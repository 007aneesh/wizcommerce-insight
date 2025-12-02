import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, ShoppingCart, Bell, Zap, Package, Eye } from "lucide-react";
import { CartDrawer } from "@/components/CartDrawer";

// TODO: Replace with actual API data
const mockStats = [
  { label: "Active Buyers", value: "1,247", change: "+12.5%", icon: Users, color: "primary" },
  { label: "Active Triggers", value: "23", change: "+3", icon: Zap, color: "secondary" },
  { label: "Abandoned Carts", value: "156", change: "-8.2%", icon: ShoppingCart, color: "destructive" },
  { label: "Notifications Sent", value: "4,892", change: "+23.1%", icon: Bell, color: "primary" },
];

export default function Dashboard() {
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-purple to-brand-purple-dark p-8 text-primary-foreground">
        <div className="relative z-10">
          <h1 className="mb-2 text-4xl font-bold">
            AI-Powered Sales Platform
          </h1>
          <p className="mb-6 text-lg opacity-90">
            Manage buyers, triggers, and notifications all in one place
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent" />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {mockStats.map((stat) => {
          const Icon = stat.icon;
          const isCart = stat.label === "Abandoned Carts";
          return (
            <Card key={stat.label} className="p-6 transition-all hover:shadow-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                  <p className="mt-1 text-sm text-secondary">{stat.change}</p>
                  {isCart && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 gap-2 text-xs"
                      onClick={() => setIsCartDrawerOpen(true)}
                    >
                      <Eye className="h-3 w-3" />
                      View Full Cart
                    </Button>
                  )}
                </div>
                <div className="rounded-lg bg-primary/10 p-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-secondary/10 p-2">
              <Package className="h-5 w-5 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold">Recent Collections</h3>
          </div>
          <div className="space-y-3">
            {/* TODO: API Integration - Fetch recent collections */}
            <p className="text-sm text-muted-foreground">
              New collection launches will appear here. Connect to your product API to display real-time data.
            </p>
            <div className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
              API Integration Required
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Top Trending Products</h3>
          </div>
          <div className="space-y-3">
            {/* TODO: API Integration - Fetch trending products */}
            <p className="text-sm text-muted-foreground">
              Trending products based on buyer activity will be shown here.
            </p>
            <div className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
              API Integration Required
            </div>
          </div>
        </Card>
      </div>

      {/* Cart Drawer */}
      <CartDrawer 
        open={isCartDrawerOpen} 
        onOpenChange={setIsCartDrawerOpen}
        buyerId="BUYER-001"
      />
    </div>
  );
}
