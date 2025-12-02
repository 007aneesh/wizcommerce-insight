import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, TrendingUp, ShoppingBag, Package, Star, Bell, Users } from "lucide-react";

// TODO: Replace with actual API data from your backend
const mockBuyers = [
  {
    id: 1,
    name: "Acme Wholesale Co.",
    email: "orders@acmewholesale.com",
    totalOrders: 247,
    avgOrderValue: "$12,450",
    lastOrder: "2 days ago",
    status: "active",
    bestSellers: ["Product A", "Product B", "Product C"],
    trendingItems: ["Product X", "Product Y"],
  },
  {
    id: 2,
    name: "Global Distributors LLC",
    email: "purchasing@globaldist.com",
    totalOrders: 189,
    avgOrderValue: "$8,920",
    lastOrder: "1 week ago",
    status: "active",
    bestSellers: ["Product D", "Product E"],
    trendingItems: ["Product Z"],
  },
  {
    id: 3,
    name: "Premium Retail Group",
    email: "buying@premiumretail.com",
    totalOrders: 156,
    avgOrderValue: "$15,200",
    lastOrder: "3 days ago",
    status: "active",
    bestSellers: ["Product F", "Product G", "Product H"],
    trendingItems: ["Product W", "Product V"],
  },
];

export default function Buyers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBuyer, setSelectedBuyer] = useState<typeof mockBuyers[0] | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Buyer Management</h1>
        <p className="mt-2 text-muted-foreground">
          View and manage all your buyers with advanced insights
        </p>
      </div>

      {/* Search & Filter Bar */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search buyers by name, email, or order history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </Card>

      {/* Buyers Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Buyers List */}
        <div className="space-y-4">
          {/* TODO: API Integration Point - Replace mockBuyers with actual API call */}
          {/* Example: const { data: buyers } = useQuery('buyers', fetchBuyers) */}
          {mockBuyers
            .filter(
              (buyer) =>
                buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                buyer.email.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((buyer) => (
              <Card
                key={buyer.id}
                className={`cursor-pointer p-6 transition-all hover:shadow-lg ${
                  selectedBuyer?.id === buyer.id ? "border-primary ring-2 ring-primary/20" : ""
                }`}
                onClick={() => setSelectedBuyer(buyer)}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{buyer.name}</h3>
                      <p className="text-sm text-muted-foreground">{buyer.email}</p>
                    </div>
                    <Badge variant={buyer.status === "active" ? "default" : "secondary"}>
                      {buyer.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Orders</p>
                      <p className="text-lg font-semibold">{buyer.totalOrders}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Avg Order</p>
                      <p className="text-lg font-semibold">{buyer.avgOrderValue}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Last Order</p>
                      <p className="text-sm font-medium">{buyer.lastOrder}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
        </div>

        {/* Buyer Details Panel */}
        <div className="sticky top-24">
          {selectedBuyer ? (
            <Card className="p-6">
              <h2 className="mb-6 text-2xl font-bold">{selectedBuyer.name}</h2>

              <Tabs defaultValue="insights" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>

                <TabsContent value="insights" className="space-y-6 pt-4">
                  {/* Best Sellers */}
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <Star className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Best Sellers for This Buyer</h3>
                    </div>
                    <div className="space-y-2">
                      {/* TODO: API Integration - Fetch buyer's best selling products */}
                      {selectedBuyer.bestSellers.map((product, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3"
                        >
                          <span className="text-sm font-medium">{product}</span>
                          <Badge variant="secondary">Top {idx + 1}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trending */}
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-secondary" />
                      <h3 className="font-semibold">Trending for This Buyer</h3>
                    </div>
                    <div className="space-y-2">
                      {/* TODO: API Integration - Fetch trending products for buyer */}
                      {selectedBuyer.trendingItems.map((product, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-3"
                        >
                          <TrendingUp className="h-4 w-4 text-secondary" />
                          <span className="text-sm font-medium">{product}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Similar Products */}
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Similar to Past Orders</h3>
                    </div>
                    <div className="rounded-lg border border-dashed border-border p-4 text-center">
                      <Package className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        API Integration Required
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Connect your product recommendation engine
                      </p>
                    </div>
                  </div>

                  {/* Frequently Bought Together */}
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Frequently Bought Together</h3>
                    </div>
                    <div className="rounded-lg border border-dashed border-border p-4 text-center">
                      <p className="text-sm text-muted-foreground">
                        API Integration Required
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="orders" className="pt-4">
                  <div className="rounded-lg border border-dashed border-border p-8 text-center">
                    <ShoppingBag className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                    <h3 className="mb-2 font-semibold">Past Orders (50-100 Line Items)</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect to your order management API to display order history
                    </p>
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
