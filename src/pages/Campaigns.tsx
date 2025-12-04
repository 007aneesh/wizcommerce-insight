import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, 
  Plus, 
  Mail, 
  Calendar, 
  ShoppingCart, 
  Package, 
  Bell,
  AlertCircle,
  Clock,
  Filter
} from "lucide-react";
import { CampaignConfigModal } from "@/components/CampaignConfigModal";
import { CampaignEditModal } from "@/components/CampaignEditModal";

// TODO: Replace with actual API data
const initialMockCampaigns = [
  {
    id: 1,
    name: "New Collection Launch",
    type: "collection",
    status: "active",
    description: "Notify buyers when new collections are launched",
    lastTriggered: "2 hours ago",
    emailCount: 156,
    config: {
      collection_id: "",
      base_prompt: "Introduce the new collection to buyers...",
      target_segment: "all",
    },
  },
  {
    id: 2,
    name: "Weekly Buyer Updates",
    type: "scheduled",
    status: "active",
    description: "Send weekly updates to all active buyers",
    lastTriggered: "3 days ago",
    emailCount: 1247,
    config: {
      frequency: "weekly",
      schedule: "09:00",
      target_segment: "active",
    },
  },
  {
    id: 3,
    name: "Event Notifications",
    type: "event",
    status: "inactive",
    description: "Send personalized emails based on specific buyer events",
    lastTriggered: "1 hour ago",
    emailCount: 89,
    config: {
      event_type: "price_drop",
      conditions: '{"price_threshold": 50}',
      target_segment: "all",
    },
  },
  {
    id: 4,
    name: "Abandoned Cart Reminders",
    type: "cart",
    status: "active",
    description: "Alert buyers when items in their cart are low stock",
    lastTriggered: "30 minutes ago",
    emailCount: 45,
    config: {
      delay: "24",
      stock_threshold: "5",
      min_cart_value: "50",
      target_segment: "all",
    },
  },
  {
    id: 5,
    name: "Product Update Notifications",
    type: "product",
    status: "inactive",
    description: "Notify buyers when watched products are updated",
    lastTriggered: "5 hours ago",
    emailCount: 234,
    config: {
      product_ids: "",
      update_types: "all",
      target_segment: "all",
    },
  },
];

const campaignTypes = [
  { id: "collection", label: "Collection Launch", icon: Package, color: "primary" },
  { id: "scheduled", label: "Scheduled Emails", icon: Calendar, color: "secondary" },
  { id: "event", label: "Event Campaigns", icon: Zap, color: "primary" },
  { id: "cart", label: "Inventory Alerts", icon: ShoppingCart, color: "destructive" },
  { id: "product", label: "Product Updates", icon: Bell, color: "primary" },
];

export default function Campaigns() {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [campaigns, setCampaigns] = useState(initialMockCampaigns);

  // Filter campaigns by type and active status
  const filteredCampaigns = campaigns.filter((c) => {
    const typeMatch = selectedType === "all" || c.type === selectedType;
    const activeMatch = !showActiveOnly || c.status === "active";
    return typeMatch && activeMatch;
  });

  const handleStatusToggle = (campaignId: number | string, checked: boolean) => {
    setCampaigns((prev) =>
      prev.map((campaign) =>
        campaign.id === campaignId
          ? { ...campaign, status: checked ? "active" : "inactive" }
          : campaign
      )
    );
    // TODO: API Integration - Update campaign status
    // await apiClient.updateCampaignStatus(campaignId, checked ? "active" : "inactive");
  };

  const handleConfigureClick = (campaign: any) => {
    setSelectedCampaign(campaign);
    setIsEditModalOpen(true);
  };

  const handleUpdateSuccess = () => {
    // Refresh campaigns list after update
    // TODO: Fetch updated campaigns from API
    setIsEditModalOpen(false);
    setSelectedCampaign(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaign Management</h1>
          <p className="mt-2 text-muted-foreground">
            Create and manage AI-powered email marketing campaigns
          </p>
        </div>
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" />
          New Campaign
        </Button>
      </div>

      {/* Campaign Type Filters */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filter Campaigns</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Show active only</span>
            </div>
            <Switch
              checked={showActiveOnly}
              onCheckedChange={setShowActiveOnly}
            />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-5">
          <button
            onClick={() => setSelectedType("all")}
            className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all hover:shadow-md ${
              selectedType === "all"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="rounded-lg bg-primary/10 p-3">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <span className="text-sm font-medium">All Types</span>
          </button>
          {campaignTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                  selectedType === type.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="rounded-lg bg-primary/10 p-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Active Campaigns List */}
      <div className="space-y-4">
        {filteredCampaigns.length === 0 ? (
          <Card className="p-12 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No campaigns found</h3>
            <p className="text-sm text-muted-foreground">
              {showActiveOnly && selectedType !== "all"
                ? "No active campaigns of this type"
                : showActiveOnly
                ? "No active campaigns"
                : "Try adjusting your filters"}
            </p>
          </Card>
        ) : (
          filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="p-6 transition-all hover:shadow-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="text-xl font-semibold">{campaign.name}</h3>
                    <Badge variant={campaign.status === "active" ? "default" : "secondary"}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground">{campaign.description}</p>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Last sent: {campaign.lastTriggered}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {campaign.emailCount} emails sent
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {campaign.status === "active" ? "Active" : "Inactive"}
                      </span>
                      <Switch 
                        checked={campaign.status === "active"} 
                        onCheckedChange={(checked) => handleStatusToggle(campaign.id, checked)}
                      />
                    </div>
                    {campaign.status === "active" && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleConfigureClick(campaign)}
                      >
                        Configure
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* API Integration Notice */}
      <Card className="border-dashed bg-muted/30 p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-primary/10 p-2">
            <AlertCircle className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="mb-2 font-semibold">API Integration Required</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              To enable these campaigns, configure the following endpoints:
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• POST /api/campaigns/collection-launch - New collection campaigns</li>
              <li>• POST /api/campaigns/scheduled - Regular interval campaigns</li>
              <li>• POST /api/campaigns/event - Event-based campaigns</li>
              <li>• POST /api/campaigns/abandoned-cart - Cart abandonment campaigns</li>
              <li>• POST /api/campaigns/product-update - Product update campaigns</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Campaign Configuration Details */}
      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Campaign Configuration Details</h2>
        <Tabs defaultValue="requirements" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="requirements">Data Requirements</TabsTrigger>
            <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
          </TabsList>

          <TabsContent value="requirements" className="pt-4">
            <div className="space-y-4">
              <div className="rounded-lg border border-border p-4">
                <h3 className="mb-2 font-semibold">Required Buyer Data Fields:</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Buyer name/company name</li>
                  <li>• Past orders (50-100 line items)</li>
                  <li>• Product preferences/watch list</li>
                  <li>• Notification preferences</li>
                  <li>• Abandoned cart items</li>
                  <li>• Best seller preferences per buyer</li>
                </ul>
              </div>

              <div className="rounded-lg border border-border p-4">
                <h3 className="mb-2 font-semibold">Event Campaign Data:</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Event type (collection launch, stock update, price change)</li>
                  <li>• Product/collection IDs affected</li>
                  <li>• Timestamp</li>
                  <li>• Related buyer IDs to notify</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="endpoints" className="pt-4">
            <div className="space-y-3">
              <div className="rounded-lg border border-border p-4">
                <code className="text-sm text-primary">POST /api/campaigns/execute</code>
                <p className="mt-2 text-sm text-muted-foreground">
                  Execute a specific campaign by ID
                </p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <code className="text-sm text-primary">GET /api/buyers/:id/preferences</code>
                <p className="mt-2 text-sm text-muted-foreground">
                  Fetch buyer notification preferences
                </p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <code className="text-sm text-primary">POST /api/notifications/send</code>
                <p className="mt-2 text-sm text-muted-foreground">
                  Send notification to specific buyers
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Campaign Configuration Modal */}
      <CampaignConfigModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      
      {/* Campaign Edit Modal */}
      <CampaignEditModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        campaign={selectedCampaign}
        onUpdate={handleUpdateSuccess}
      />
    </div>
  );
}
