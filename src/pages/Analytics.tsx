import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Users, Package, ShoppingBag } from "lucide-react";

export default function Analytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics & Insights</h1>
        <p className="mt-2 text-muted-foreground">
          Track buyer behavior, product performance, and trends
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="buyers">Buyer Insights</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Sales Trends</h3>
              </div>
              <div className="rounded-lg border border-dashed border-border p-12 text-center">
                <p className="text-sm text-muted-foreground">
                  Chart visualization will appear here
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  API Integration Required
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-secondary/10 p-2">
                  <Users className="h-5 w-5 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold">Buyer Activity</h3>
              </div>
              <div className="rounded-lg border border-dashed border-border p-12 text-center">
                <p className="text-sm text-muted-foreground">
                  Activity timeline will appear here
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  API Integration Required
                </p>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="buyers" className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4 text-xl font-semibold">Buyer Insights</h3>
            <div className="space-y-4">
              <div className="rounded-lg border border-dashed border-border p-8 text-center">
                <Users className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                <h4 className="mb-2 font-semibold">Per-Buyer Analytics</h4>
                <p className="text-sm text-muted-foreground">
                  Connect to display:
                </p>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  <li>• Best sellers per buyer</li>
                  <li>• Similar products to past orders</li>
                  <li>• Frequently bought together items</li>
                  <li>• Trending products for each buyer</li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4 text-xl font-semibold">Product Performance</h3>
            <div className="rounded-lg border border-dashed border-border p-8 text-center">
              <Package className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Product analytics and performance metrics
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                API Integration Required
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4 text-xl font-semibold">Trending Analysis</h3>
            <div className="rounded-lg border border-dashed border-border p-8 text-center">
              <TrendingUp className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Market trends and buyer behavior patterns
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                API Integration Required
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
