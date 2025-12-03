import { useState, useEffect, useCallback, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, TrendingUp, ShoppingBag, Package, Star, Bell, Users, Loader2 } from "lucide-react";
import { apiClient, ApiError } from "@/lib/api";
import type { BuyerHit, BuyerSearchResponse, OrderData, OrderSearchResponse } from "@/lib/types";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";

export default function Buyers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBuyer, setSelectedBuyer] = useState<BuyerHit | null>(null);
  const [buyers, setBuyers] = useState<BuyerHit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  
  // Orders state
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingMoreOrders, setIsLoadingMoreOrders] = useState(false);
  const [ordersStartRow, setOrdersStartRow] = useState(0);
  const [ordersEndRow, setOrdersEndRow] = useState(100);
  const [hasMoreOrders, setHasMoreOrders] = useState(true);
  
  const debouncedSearch = useDebounce(searchQuery, 500);
  const observerTarget = useRef<HTMLDivElement>(null);
  const ordersObserverTarget = useRef<HTMLDivElement>(null);

  const fetchBuyers = useCallback(async (page: number, search: string, reset: boolean = false) => {
    try {
      if (reset) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const response: BuyerSearchResponse = await apiClient.searchBuyers({
        search: search,
        filters: {
          id: [],
        },
        sort: [],
        aggregate: false,
        page_number: page,
        page_size: 15,
        exclude_ids: [],
      });

      if (reset) {
        setBuyers(response.data.hits);
      } else {
        setBuyers((prev) => [...prev, ...response.data.hits]);
      }

      setCurrentPage(response.data.page);
      setTotalPages(response.data.nbPages);
      setHasMore(response.data.page < response.data.nbPages);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message || "Failed to fetch buyers");
      } else {
        toast.error("An unexpected error occurred");
      }
      console.error("Error fetching buyers:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  // Initial load and search
  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    fetchBuyers(1, debouncedSearch, true);
  }, [debouncedSearch, fetchBuyers]);

  // Fetch orders for selected buyer
  const fetchOrders = useCallback(async (buyerId: string, startRow: number, endRow: number, reset: boolean = false) => {
    try {
      if (reset) {
        setIsLoadingOrders(true);
      } else {
        setIsLoadingMoreOrders(true);
      }

      const response: any = await apiClient.searchOrders({
        startRow,
        endRow,
        sortModel: [
          {
            colId: 'updated_at',
            sort: 'desc',
          },
        ],
        filterModel: {
          created_at_milliseconds: {
            filterType: 'date',
            type: 'inRange',
            filter: null,
            filterTo: null,
          },
          buyer_id: {
            filterType: 'text',
            type: 'equals',
            filter: buyerId,
          },
          type: {
            filterType: 'text',
            type: 'equals',
            filter: 'order',
            filterTo: null,
          },
        },
      });

      if (reset) {
        setOrders(response.data || []);
      } else {
        setOrders((prev) => [...prev, ...(response.data || [])]);
      }

      // Check if there are more orders
      const lastRow = response.endRow ?? response.data?.length ?? 0;
      setHasMoreOrders(lastRow >= endRow);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message || "Failed to fetch orders");
      } else {
        toast.error("An unexpected error occurred while fetching orders");
      }
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoadingOrders(false);
      setIsLoadingMoreOrders(false);
    }
  }, []);

  // Fetch orders when buyer is selected
  useEffect(() => {
    if (selectedBuyer) {
      setOrdersStartRow(0);
      setOrdersEndRow(100);
      setHasMoreOrders(true);
      fetchOrders(selectedBuyer.id, 0, 100, true);
    } else {
      setOrders([]);
    }
  }, [selectedBuyer, fetchOrders]);

  // Infinite scroll observer for buyers
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !isLoadingMore) {
          const nextPage = currentPage + 1;
          fetchBuyers(nextPage, debouncedSearch, false);
        }
      },
      { threshold: 1.0 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading, isLoadingMore, currentPage, debouncedSearch, fetchBuyers]);

  // Infinite scroll observer for orders
  useEffect(() => {
    if (!selectedBuyer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreOrders && !isLoadingOrders && !isLoadingMoreOrders) {
          const nextStartRow = ordersEndRow;
          const nextEndRow = ordersEndRow + 100;
          setOrdersStartRow(nextStartRow);
          setOrdersEndRow(nextEndRow);
          fetchOrders(selectedBuyer.id, nextStartRow, nextEndRow, false);
        }
      },
      { threshold: 1.0 }
    );

    const currentTarget = ordersObserverTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMoreOrders, isLoadingOrders, isLoadingMoreOrders, ordersEndRow, selectedBuyer, fetchOrders]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Buyer Management</h1>
        <p className="mt-2 text-muted-foreground">
          View and manage all your buyers with advanced insights
        </p>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search buyers by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          {isLoading && buyers.length === 0 ? (
            <Card className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </Card>
          ) : buyers.length === 0 ? (
            <Card className="flex items-center justify-center p-12">
              <div className="text-center">
                <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No buyers found
                </p>
              </div>
            </Card>
          ) : (
            <>
              {buyers.map((buyer) => (
                <Card
                  key={buyer.id}
                  className={`cursor-pointer p-6 transition-all hover:shadow-lg ${
                    selectedBuyer?.id === buyer.id ? "border-primary ring-2 ring-primary/20" : ""
                  }`}
                  onClick={() => setSelectedBuyer(buyer)}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{buyer.buyer_name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{buyer.location}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Quote</p>
                        <p className="text-lg font-semibold">{buyer.order_details.Quote}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Orders</p>
                        <p className="text-lg font-semibold">{buyer.order_details.Orders}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Drafts</p>
                        <p className="text-lg font-semibold">{buyer.order_details.Drafts}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              
              <div ref={observerTarget} className="h-4">
                {isLoadingMore && (
                  <Card className="flex items-center justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </Card>
                )}
              </div>
            </>
          )}
        </div>

        <div className="lg:sticky lg:top-20 self-start">
          {selectedBuyer ? (
            <Card className="p-6 max-h-[calc(100vh-8rem)] flex flex-col">
              <h2 className="mb-6 text-2xl font-bold flex-shrink-0">{selectedBuyer.buyer_name}</h2>

              <Tabs defaultValue="insights" className="w-full flex-1 flex flex-col min-h-0">
                <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-y-auto min-h-0">
                <TabsContent value="insights" className="space-y-6 pt-4">
                  {/* Order Details */}
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Order Details</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3">
                        <span className="text-sm font-medium">Quotes</span>
                        <Badge variant="secondary">{selectedBuyer.order_details.Quote}</Badge>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3">
                        <span className="text-sm font-medium">Orders</span>
                        <Badge variant="secondary">{selectedBuyer.order_details.Orders}</Badge>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3">
                        <span className="text-sm font-medium">Drafts</span>
                        <Badge variant="secondary">{selectedBuyer.order_details.Drafts}</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Location</h3>
                    </div>
                    <div className="rounded-lg border border-border bg-muted/50 p-4">
                      <p className="text-sm">{selectedBuyer.location}</p>
                      <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                        <span>City: {selectedBuyer.city}</span>
                        <span>State: {selectedBuyer.state}</span>
                        <span>Zip: {selectedBuyer.zipcode}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <Star className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Additional Information</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3">
                        <span className="text-sm font-medium">System ID</span>
                        <span className="text-sm text-muted-foreground">{selectedBuyer.system_id}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3">
                        <span className="text-sm font-medium">Reference ID</span>
                        <span className="text-sm text-muted-foreground">{selectedBuyer.reference_id}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3">
                        <span className="text-sm font-medium">Total Carts</span>
                        <span className="text-sm text-muted-foreground">{selectedBuyer.total_carts}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="orders" className="pt-4">
                  <div className="space-y-4">
                    {isLoadingOrders && orders.length === 0 ? (
                      <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-border p-8 text-center">
                        <ShoppingBag className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                        <h3 className="mb-2 font-semibold">No Orders Found</h3>
                        <p className="text-sm text-muted-foreground">
                          This buyer has no orders yet
                        </p>
                      </div>
                    ) : (
                      <>
                        {orders.map((order) => {
                          const orderId = order.reference_id || order.id || 'N/A';
                          const orderValue = order.total_value ?? 0;
                          const createdOn = order.created_on || order.created_at || 'N/A';
                          const salesRepName = order.sales_rep_name || 'N/A';
                          const salesRepEmail = order.sales_rep_email || order.email || 'N/A';

                          return (
                            <Card key={order.id || orderId} className="p-4">
                              <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-semibold">Reference ID: {orderId}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      Created: {typeof createdOn === 'string' ? new Date(createdOn).toLocaleDateString() : createdOn}
                                    </p>
                                  </div>
                                  <Badge variant="secondary" className="text-sm">
                                    ${orderValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </Badge>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                                  <div>
                                    <p className="text-xs text-muted-foreground">Sales Rep</p>
                                    <p className="text-sm font-medium">{salesRepName}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Email</p>
                                    <p className="text-sm font-medium">{salesRepEmail}</p>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                        
                        {/* Infinite scroll trigger for orders */}
                        <div ref={ordersObserverTarget} className="h-4">
                          {isLoadingMoreOrders && (
                            <Card className="flex items-center justify-center p-4">
                              <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </Card>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="preferences" className="pt-4">
                  <div className="space-y-4">
                    <div className="rounded-lg border border-dashed border-border p-6 text-center">
                      <Bell className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Notification preferences and watched products will appear here
                      </p>
                    </div>
                  </div>
                </TabsContent>
                </div>
              </Tabs>
            </Card>
          ) : (
            <Card className="flex h-full items-center justify-center p-12">
              <div className="text-center">
                <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Select a buyer to view detailed insights
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
