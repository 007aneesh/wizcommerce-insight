import { useState } from "react";
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
import { ShoppingCart, Package, AlertCircle, X } from "lucide-react";

// TODO: Replace with actual API data
const mockCartItems = [
  {
    id: 1,
    productId: "PRD001",
    name: "Premium Wireless Headphones",
    quantity: 2,
    price: 299.99,
    image: "/placeholder.svg",
    stock: 15,
    sku: "WH-001",
  },
  {
    id: 2,
    productId: "PRD002",
    name: "Smart Watch Series 5",
    quantity: 1,
    price: 449.99,
    image: "/placeholder.svg",
    stock: 8,
    sku: "SW-005",
  },
  {
    id: 3,
    productId: "PRD003",
    name: "Laptop Stand - Aluminum",
    quantity: 3,
    price: 79.99,
    image: "/placeholder.svg",
    stock: 3,
    sku: "LS-ALU-01",
  },
];

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  buyerId?: string;
}

export function CartDrawer({ open, onOpenChange, buyerId }: CartDrawerProps) {
  const [cartItems] = useState(mockCartItems);
  
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DrawerTitle>Shopping Cart</DrawerTitle>
                <DrawerDescription>
                  {cartItems.length} items • Buyer ID: {buyerId || "N/A"}
                </DrawerDescription>
              </div>
            </div>
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {/* TODO: API Integration - Fetch cart items by buyerId */}
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-muted">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                      <Separator orientation="vertical" className="h-4" />
                      <Badge 
                        variant={item.stock < 5 ? "destructive" : "secondary"}
                        className="gap-1"
                      >
                        {item.stock < 5 && <AlertCircle className="h-3 w-3" />}
                        {item.stock} in stock
                      </Badge>
                    </div>
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="mt-6 space-y-3 rounded-lg border border-border bg-muted/30 p-4">
            <h4 className="font-semibold">Order Summary</h4>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (10%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* API Notice */}
          <div className="mt-4 rounded-lg border border-dashed border-border bg-muted/30 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">
                  <strong>API Integration Required:</strong> Connect to{" "}
                  <code className="text-primary">GET /api/buyers/:id/cart</code> to fetch real cart data.
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DrawerFooter className="border-t">
          <div className="flex gap-3">
            <Button className="flex-1" size="lg">
              Proceed to Checkout
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" size="lg">
                Close
              </Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
