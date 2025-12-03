import { useState, useEffect, useCallback, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ShoppingCart, Search, Loader2, Eye } from "lucide-react";
import { apiClient, ApiError } from "@/lib/api";
import type { AbandonedCartData, AbandonedCartSearchResponse } from "@/lib/types";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";
import { AbandonedCartDrawer } from "@/components/AbandonedCartDrawer";

export default function AbandonedCarts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [carts, setCarts] = useState<AbandonedCartData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [startRow, setStartRow] = useState(0);
  const [endRow, setEndRow] = useState(100);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [selectedCart, setSelectedCart] = useState<AbandonedCartData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const debouncedSearch = useDebounce(searchQuery, 500);
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchAbandonedCarts = useCallback(async (
    start: number, 
    end: number, 
    filter: string, 
    reset: boolean = false
  ) => {
    try {
      if (reset) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const filterModel: any = {};
      if (filter.trim()) {
        filterModel.customer_name = {
          filterType: "text",
          type: "contains",
          filter: filter.trim(),
        };
      }

      const response: AbandonedCartSearchResponse = await apiClient.searchAbandonedCarts({
        startRow: start,
        endRow: end,
        sortModel: [],
        filterModel,
      });

      if (reset) {
        setCarts(response.data || []);
      } else {
        setCarts((prev) => [...prev, ...(response.data || [])]);
      }

      setTotal(response.total || 0);
      
      // Check if there are more carts
      const fetchedCount = response.data?.length || 0;
      setHasMore(fetchedCount >= (end - start));
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message || "Failed to fetch abandoned carts");
      } else {
        toast.error("An unexpected error occurred");
      }
      console.error("Error fetching abandoned carts:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  // Initial load and search
  useEffect(() => {
    setStartRow(0);
    setEndRow(100);
    setHasMore(true);
    fetchAbandonedCarts(0, 100, debouncedSearch, true);
  }, [debouncedSearch, fetchAbandonedCarts]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !isLoadingMore) {
          const nextStartRow = endRow;
          const nextEndRow = endRow + 100;
          setStartRow(nextStartRow);
          setEndRow(nextEndRow);
          fetchAbandonedCarts(nextStartRow, nextEndRow, debouncedSearch, false);
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
  }, [hasMore, isLoading, isLoadingMore, endRow, debouncedSearch, fetchAbandonedCarts]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'default';
      case 'closed':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const handleViewCart = (cart: AbandonedCartData) => {
    setSelectedCart(cart);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Abandoned Carts</h1>
        <p className="mt-2 text-muted-foreground">
          View and manage all abandoned carts
        </p>
      </div>

      {/* Summary Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Abandoned Carts</p>
            <p className="mt-2 text-3xl font-bold">{total}</p>
          </div>
          <div className="rounded-lg bg-destructive/10 p-3">
            <ShoppingCart className="h-6 w-6 text-destructive" />
          </div>
        </div>
      </Card>

      {/* Filter Input */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        {isLoading && carts.length === 0 ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : carts.length === 0 ? (
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <ShoppingCart className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No abandoned carts found
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Cart Total</TableHead>
                  <TableHead>Total SKUs</TableHead>
                  <TableHead>Total Units</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {carts.map((cart) => (
                  <TableRow key={cart.id}>
                    <TableCell className="font-medium">
                      {cart.website_user_name || cart.customer_name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {cart.website_user_email || 'N/A'}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(cart.cart_total)}
                    </TableCell>
                    <TableCell>{cart.total_skus}</TableCell>
                    <TableCell>{cart.total_units}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(cart.status)}>
                        {cart.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewCart(cart)}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Infinite scroll trigger */}
            <div ref={observerTarget} className="h-4">
              {isLoadingMore && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Abandoned Cart Drawer */}
      <AbandonedCartDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        cart={selectedCart}
      />
    </div>
  );
}
