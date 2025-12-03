import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, ShoppingCart, Bell, Zap, Package, Eye, Loader2 } from "lucide-react";
import { CartDrawer } from "@/components/CartDrawer";
import { CollectionCard } from "@/components/CollectionCard";
import { useCatalogStore } from "@/store/catalogStore";
import { apiClient, ApiError } from "@/lib/api";
import type { CollectionData } from "@/lib/types";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// TODO: Replace with actual API data
const mockStats = [
  { label: "Active Buyers", value: "1,247", change: "+12.5%", icon: Users, color: "primary" },
  { label: "Active Triggers", value: "23", change: "+3", icon: Zap, color: "secondary" },
  { label: "Abandoned Carts", value: "156", change: "-8.2%", icon: ShoppingCart, color: "destructive" },
  { label: "Notifications Sent", value: "4,892", change: "+23.1%", icon: Bell, color: "primary" },
];

export default function Dashboard() {
  const [collections, setCollections] = useState<CollectionData[]>([]);
  const [isLoadingCollections, setIsLoadingCollections] = useState(false);

  const navigate = useNavigate();
  const { selectedCatalog } = useCatalogStore();

  // Fetch collections
  useEffect(() => {
    const fetchCollections = async () => {
      if (!selectedCatalog) return;

      try {
        setIsLoadingCollections(true);
        const response = await apiClient.searchCollections(selectedCatalog.value);
        
        if (response.data) {
          // Get recent collections (first 6)
          setCollections(response.data.slice(0, 6));
        }
      } catch (error) {
        if (error instanceof ApiError) {
          toast.error("Failed to load collections");
        }
        console.error("Error fetching collections:", error);
      } finally {
        setIsLoadingCollections(false);
      }
    };

    fetchCollections();
  }, [selectedCatalog]);

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
                </div>
                <div className="rounded-lg bg-primary/10 p-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Collections - Takes 2 columns */}
        <div className="lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-secondary/10 p-2">
                <Package className="h-5 w-5 text-secondary" />
              </div>
              <h2 className="text-2xl font-semibold">Recent Collections</h2>
            </div>
          </div>
          
          {isLoadingCollections ? (
            <Card className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </Card>
          ) : collections.length === 0 ? (
            <Card className="p-6">
              <div className="rounded-lg border border-dashed border-border p-8 text-center">
                <Package className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No collections available
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {collections.slice(0, 4).map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats / Actions - Takes 1 column */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Quick Stats</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Collections</span>
                <span className="font-semibold">{collections.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Catalog</span>
                <span className="font-semibold text-sm">{selectedCatalog?.label || 'None'}</span>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Collections are fetched from your active catalog
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-secondary/10 p-2">
                <Bell className="h-5 w-5 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold">Quick Actions</h3>
            </div>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm" onClick={() => navigate("/triggers")}>
                <Zap className="mr-2 h-4 w-4" />
                Create New Trigger
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm" onClick={() => navigate("/buyers")}>
                <Users className="mr-2 h-4 w-4" />
                View All Buyers
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm" onClick={() => navigate("/abandoned-carts")}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Check Carts
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
