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
  Clock
} from "lucide-react";
import { TriggerConfigModal } from "@/components/TriggerConfigModal";

// TODO: Replace with actual API data
const mockTriggers = [
  {
    id: 1,
    name: "New Collection Launch",
    type: "collection",
    status: "active",
    description: "Notify buyers when new collections are launched",
    lastTriggered: "2 hours ago",
    triggerCount: 156,
  },
  {
    id: 2,
    name: "Weekly Buyer Updates",
    type: "scheduled",
    status: "active",
    description: "Send weekly updates to all active buyers",
    lastTriggered: "3 days ago",
    triggerCount: 1247,
  },
  {
    id: 3,
    name: "Event Notifications",
    type: "event",
    status: "active",
    description: "Trigger notifications based on specific buyer events",
    lastTriggered: "1 hour ago",
    triggerCount: 89,
  },
  {
    id: 4,
    name: "Abandoned Cart Reminders",
    type: "cart",
    status: "active",
    description: "Alert buyers when items in their cart are low stock",
    lastTriggered: "30 minutes ago",
    triggerCount: 45,
  },
  {
    id: 5,
    name: "Product Update Notifications",
    type: "product",
    status: "active",
    description: "Notify buyers when watched products are updated",
    lastTriggered: "5 hours ago",
    triggerCount: 234,
  },
];

const triggerTypes = [
  { id: "collection", label: "Collection Launch", icon: Package, color: "primary" },
  { id: "scheduled", label: "Scheduled Emails", icon: Calendar, color: "secondary" },
  { id: "event", label: "Event Triggers", icon: Zap, color: "primary" },
  { id: "cart", label: "Inventory Alerts", icon: ShoppingCart, color: "destructive" },
  { id: "product", label: "Product Updates", icon: Bell, color: "primary" },
];

export default function Triggers() {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTriggers =
    selectedType === "all"
      ? mockTriggers
      : mockTriggers.filter((t) => t.type === selectedType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Trigger Management</h1>
          <p className="mt-2 text-muted-foreground">
            Configure automated email triggers and notifications
          </p>
        </div>
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" />
          New Trigger
        </Button>
      </div>

      {/* Trigger Type Filters */}
      <Card className="p-6">
        <div className="grid gap-4 md:grid-cols-5">
          {triggerTypes.map((type) => {
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

      {/* Active Triggers List */}
      <div className="space-y-4">
        {/* TODO: API Integration Point - Replace mockTriggers with actual API call */}
        {/* Example: const { data: triggers } = useQuery('triggers', fetchTriggers) */}
        {filteredTriggers.map((trigger) => (
          <Card key={trigger.id} className="p-6 transition-all hover:shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-3">
                  <h3 className="text-xl font-semibold">{trigger.name}</h3>
                  <Badge variant={trigger.status === "active" ? "default" : "secondary"}>
                    {trigger.status}
                  </Badge>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">{trigger.description}</p>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Last triggered: {trigger.lastTriggered}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {trigger.triggerCount} notifications sent
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Switch checked={trigger.status === "active"} />
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
            </div>
          </Card>
        ))}
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
              To enable these triggers, configure the following endpoints:
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• POST /api/triggers/collection-launch - New collection notifications</li>
              <li>• POST /api/triggers/scheduled - Regular interval notifications</li>
              <li>• POST /api/triggers/event - Event-based triggers</li>
              <li>• POST /api/triggers/abandoned-cart - Cart abandonment alerts</li>
              <li>• POST /api/triggers/product-update - Product update notifications</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Trigger Configuration Details */}
      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Trigger Configuration Details</h2>
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
                <h3 className="mb-2 font-semibold">Event Trigger Data:</h3>
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
                <code className="text-sm text-primary">POST /api/triggers/execute</code>
                <p className="mt-2 text-sm text-muted-foreground">
                  Execute a specific trigger by ID
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

      {/* Trigger Configuration Modal */}
      <TriggerConfigModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
