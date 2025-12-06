import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Zap, 
  Plus, 
  Mail, 
  Calendar, 
  ShoppingCart, 
  Package, 
  Bell,
  Clock
} from "lucide-react";
import { CampaignConfigModal } from "@/components/CampaignConfigModal";

// TODO: Replace with actual API data
const mockCampaigns = [
  {
    id: 1,
    name: "New Collection Launch",
    type: "collection",
    status: "active",
    description: "Notify buyers when new collections are launched",
    lastTriggered: "2 hours ago",
    emailCount: 156,
  },
  {
    id: 2,
    name: "Weekly Buyer Updates",
    type: "scheduled",
    status: "active",
    description: "Send weekly updates to all active buyers",
    lastTriggered: "3 days ago",
    emailCount: 1247,
  },
  {
    id: 3,
    name: "Event Notifications",
    type: "event",
    status: "active",
    description: "Trigger notifications based on specific buyer events",
    lastTriggered: "1 hour ago",
    emailCount: 89,
  },
  {
    id: 4,
    name: "Abandoned Cart Reminders",
    type: "cart",
    status: "active",
    description: "Alert buyers when items in their cart are low stock",
    lastTriggered: "30 minutes ago",
    emailCount: 45,
  },
  {
    id: 5,
    name: "Product Update Notifications",
    type: "product",
    status: "active",
    description: "Notify buyers when watched products are updated",
    lastTriggered: "5 hours ago",
    emailCount: 234,
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

  const filteredCampaigns =
    selectedType === "all"
      ? mockCampaigns
      : mockCampaigns.filter((c) => c.type === selectedType);

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
        <div className="grid gap-4 md:grid-cols-5">
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
        {/* TODO: API Integration Point - Replace mockCampaigns with actual API call */}
        {/* Example: const { data: campaigns } = useQuery('campaigns', fetchCampaigns) */}
        {filteredCampaigns.map((campaign) => (
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
                <Switch checked={campaign.status === "active"} />
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Campaign Configuration Modal */}
      <CampaignConfigModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
