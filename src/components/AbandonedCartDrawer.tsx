import { useState, useEffect, useCallback } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, ShoppingCart, Mail, Phone, Calendar, Package, AlertCircle, Send } from "lucide-react";
import { apiClient, ApiError } from "@/lib/api";
import type { AbandonedCartData, CartDetailResponse, CartProduct } from "@/lib/types";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AbandonedCartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: AbandonedCartData | null;
}

export function AbandonedCartDrawer({ open, onOpenChange, cart }: AbandonedCartDrawerProps) {
  const [cartDetail, setCartDetail] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingReminder, setIsSendingReminder] = useState(false);

  const fetchCartDetail = useCallback(async () => {
    if (!cart) return;

    try {
      setIsLoading(true);
      const response = await apiClient.getCartDetail({
        cart_id: cart.cart_id,
        reference_user_id: cart.created_by,
      });
      setCartDetail(response);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message || "Failed to fetch cart details");
      } else {
        toast.error("An unexpected error occurred");
      }
      console.error("Error fetching cart detail:", error);
    } finally {
      setIsLoading(false);
    }
  }, [cart]);

  useEffect(() => {
    if (open && cart) {
      fetchCartDetail();
    } else {
      setCartDetail(null);
    }
  }, [open, cart, fetchCartDetail]);

  const handleSendReminder = async () => {
    if (!cart) return;

    try {
      setIsSendingReminder(true);
      // TODO: Implement send reminder API call
      toast.success("Reminder sent successfully");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message || "Failed to send reminder");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsSendingReminder(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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

  const getInventoryStatusBadge = (product: CartProduct) => {
    const inventoryStatus = product.inventory_status?.toLowerCase() || '';
    const stock = product.stock ?? 0;

    if (inventoryStatus.includes('low') || stock < 10) {
      return { variant: 'destructive' as const, label: inventoryStatus || 'Low Stock' };
    }
    if (inventoryStatus.includes('out') || stock === 0) {
      return { variant: 'destructive' as const, label: 'Out of Stock' };
    }
    return { variant: 'secondary' as const, label: inventoryStatus || 'In Stock' };
  };
  const productsObject = cartDetail?.cart?.products;
  const products = productsObject 
    ? (Array.isArray(productsObject) ? productsObject : Object.values(productsObject))
    : [];

  const cartTotal = cartDetail?.cart_total ?? cart?.cart_total ?? 0;
  const totalSkus = cartDetail?.total_skus ?? cart?.total_skus ?? 0;
  const totalUnits = cartDetail?.total_units ?? cart?.total_units ?? 0;
  const status = cartDetail?.status ?? cart?.status ?? 'open';

  const customerName = cartDetail?.customer_name || cartDetail?.website_user_name || cart?.website_user_name || cart?.customer_name || 'N/A';
  const customerEmail = cartDetail?.website_user_email || cart?.website_user_email || 'N/A';
  const customerPhone = cartDetail?.website_user_phone || cart?.website_user_phone || 'N/A';
  const createdAt = cartDetail?.created_at || cart?.created_at || 'N/A';

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] flex flex-col">
        <DrawerHeader className="border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
              <div className="flex items-center gap-2">
                <DrawerTitle>Abandoned cart products</DrawerTitle>
                <Badge variant={getStatusBadgeVariant(status)}>
                  {status}
                </Badge>
              </div>
            </div>
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 overflow-y-auto min-h-0">
          <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Buyer Information */}
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <h3 className="mb-4 font-semibold">Buyer Information</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="font-medium">{customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium">{customerEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Contact</p>
                      <p className="font-medium">{customerPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="font-medium">{createdAt !== 'N/A' ? formatDate(createdAt) : 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 font-semibold">Products</h3>
                {products.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border p-8 text-center">
                    <Package className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No products found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.map((product) => {
                      const productImage = product?.media?.[0]?.url || '/placeholder.svg';
                      const productPrice = product?.pricing?.price ?? 0;

                      return (
                        <div
                          key={product.id || product.product_id}
                          className="flex gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                        >
                          <Avatar className="h-20 w-20 rounded-lg">
                            <AvatarImage src={productImage} alt={product.name} />
                            <AvatarFallback className="rounded-lg">
                              <Package className="h-8 w-8 text-muted-foreground" />
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold">{product.name}</h4>
                                <p className="text-sm text-muted-foreground">SKU: {product.sku_id}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{formatCurrency(productPrice)}</p>
                                <p className="text-sm text-muted-foreground">per unit</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
          </div>
        </ScrollArea>

        <DrawerFooter className="border-t flex-shrink-0">
          <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
              <div className="grid grid-cols-3 gap-4 flex-1">
                <div>
                  <p className="text-xs text-muted-foreground">Cart Total</p>
                  <p className="text-lg font-bold">{formatCurrency(cartTotal)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total SKUs</p>
                  <p className="text-lg font-bold">{totalSkus}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Units</p>
                  <p className="text-lg font-bold">{totalUnits}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                className="flex-1 gap-2" 
                onClick={handleSendReminder}
                disabled={isSendingReminder}
              >
                {isSendingReminder ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Reminder
                  </>
                )}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </div>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

