import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, TrendingDown, Package, Mail, Clock } from "lucide-react";

// TODO: Replace with actual API data
const mockAbandonedCarts = [
  {
    id: 1,
    buyerName: "Acme Wholesale Co.",
    buyerEmail: "orders@acmewholesale.com",
    cartValue: "$8,450",
    itemCount: 12,
    abandonedAt: "2 hours ago",
    lastUpdate: "Stock depleting on 3 items",
    priority: "high",
    items: [
      { name: "Product A", quantity: 5, stock: "Low (12 left)" },
      { name: "Product B", quantity: 3, stock: "Low (8 left)" },
      { name: "Product C", quantity: 4, stock: "Good" },
    ],
  },
  {
    id: 2,
    buyerName: "Global Distributors LLC",
    buyerEmail: "purchasing@globaldist.com",
    cartValue: "$12,200",
    itemCount: 8,
    abandonedAt: "1 day ago",
    lastUpdate: "Price updated on 1 item",
    priority: "high",
    items: [
      { name: "Product X", quantity: 8, stock: "Low (15 left)" },
      { name: "Product Y", quantity: 2, stock: "Good" },
    ],
  },
  {
    id: 3,
    buyerName: "Premium Retail Group",
    buyerEmail: "buying@premiumretail.com",
    cartValue: "$5,600",
    itemCount: 6,
    abandonedAt: "3 days ago",
    lastUpdate: "No recent changes",
    priority: "medium",
    items: [
      { name: "Product Z", quantity: 6, stock: "Good" },
    ],
  },
  {
    id: 4,
    buyerName: "Midwest Supply Chain",
    buyerEmail: "orders@midwestsc.com",
    cartValue: "$4,800",
    itemCount: 10,
    abandonedAt: "5 hours ago",
    lastUpdate: "Stock updated on 2 items",
    priority: "high",
    items: [
      { name: "Product M", quantity: 5, stock: "Critical (3 left)" },
      { name: "Product N", quantity: 5, stock: "Low (10 left)" },
    ],
  },
  {
    id: 5,
    buyerName: "Coastal Distribution",
    buyerEmail: "buyer@coastaldist.com",
    cartValue: "$9,300",
    itemCount: 15,
    abandonedAt: "12 hours ago",
    lastUpdate: "Stock depleting on 1 item",
    priority: "high",
    items: [
      { name: "Product P", quantity: 10, stock: "Low (20 left)" },
      { name: "Product Q", quantity: 5, stock: "Good" },
    ],
  },
];

export default function AbandonedCarts() {
  const topFive = mockAbandonedCarts.slice(0, 5);
  const totalValue = mockAbandonedCarts.reduce(
    (sum, cart) => sum + parseFloat(cart.cartValue.replace(/[$,]/g, "")),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Abandoned Carts</h1>
        <p className="mt-2 text-muted-foreground">
          Top 5 abandoned carts with real-time stock and update tracking
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Abandoned</p>
              <p className="mt-2 text-3xl font-bold">{mockAbandonedCarts.length}</p>
            </div>
            <div className="rounded-lg bg-destructive/10 p-3">
              <ShoppingCart className="h-6 w-6 text-destructive" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Cart Value</p>
              <p className="mt-2 text-3xl font-bold">
                ${totalValue.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-primary/10 p-3">
              <TrendingDown className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">High Priority</p>
              <p className="mt-2 text-3xl font-bold">
                {mockAbandonedCarts.filter((c) => c.priority === "high").length}
              </p>
            </div>
            <div className="rounded-lg bg-secondary/10 p-3">
              <Package className="h-6 w-6 text-secondary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Top 5 Abandoned Carts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Top 5 Abandoned Carts</h2>
          <Button className="gap-2">
            <Mail className="h-4 w-4" />
            Send Reminders to All
          </Button>
        </div>

        {/* TODO: API Integration Point - Replace mockAbandonedCarts with actual API call */}
        {/* Example: const { data: carts } = useQuery('abandonedCarts', fetchAbandonedCarts) */}
        {topFive.map((cart, index) => (
          <Card
            key={cart.id}
            className={`p-6 transition-all hover:shadow-lg ${
              cart.priority === "high" ? "border-destructive/50" : ""
            }`}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <Badge variant="outline" className="text-lg font-bold">
                      #{index + 1}
                    </Badge>
                    <h3 className="text-xl font-semibold">{cart.buyerName}</h3>
                    <Badge
                      variant={cart.priority === "high" ? "destructive" : "secondary"}
                    >
                      {cart.priority} priority
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{cart.buyerEmail}</p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{cart.cartValue}</p>
                  <p className="text-sm text-muted-foreground">{cart.itemCount} items</p>
                </div>
              </div>

              {/* Status Info */}
              <div className="flex items-center gap-6 rounded-lg bg-muted/50 p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Abandoned: {cart.abandonedAt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{cart.lastUpdate}</span>
                </div>
              </div>

              {/* Cart Items */}
              <div>
                <h4 className="mb-3 font-semibold">Items in Cart:</h4>
                <div className="space-y-2">
                  {cart.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <Badge
                        variant={
                          item.stock.includes("Critical")
                            ? "destructive"
                            : item.stock.includes("Low")
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {item.stock}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="default" className="flex-1 gap-2">
                  <Mail className="h-4 w-4" />
                  Send Reminder
                </Button>
                <Button variant="outline">View Full Cart</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* API Integration Notice */}
      <Card className="border-dashed bg-muted/30 p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-secondary/10 p-2">
            <ShoppingCart className="h-5 w-5 text-secondary" />
          </div>
          <div className="flex-1">
            <h3 className="mb-2 font-semibold">API Integration Required</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Connect your cart management system to automatically track abandoned carts
              and send reminders when stock is depleting or prices are updated.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-semibold">Required Endpoints:</p>
              <ul className="space-y-1">
                <li>• GET /api/carts/abandoned - Fetch abandoned carts</li>
                <li>• GET /api/carts/:id/items - Get cart items with stock levels</li>
                <li>• POST /api/notifications/cart-reminder - Send cart reminders</li>
                <li>• GET /api/products/:id/stock - Real-time stock updates</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
