import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Mail, Check, Clock, Users } from "lucide-react";

// TODO: Replace with actual API data
const mockNotifications = [
  {
    id: 1,
    type: "collection",
    title: "New Collection Launch",
    message: "Spring 2025 Collection sent to 156 buyers",
    timestamp: "2 hours ago",
    status: "sent",
    recipients: 156,
  },
  {
    id: 2,
    type: "cart",
    title: "Abandoned Cart Reminder",
    message: "Reminder sent for cart with depleting stock",
    timestamp: "3 hours ago",
    status: "sent",
    recipients: 45,
  },
  {
    id: 3,
    type: "event",
    title: "Product Update Notification",
    message: "Price change alert sent to watching buyers",
    timestamp: "5 hours ago",
    status: "sent",
    recipients: 89,
  },
  {
    id: 4,
    type: "scheduled",
    title: "Weekly Buyer Summary",
    message: "Weekly digest scheduled for tomorrow",
    timestamp: "Scheduled for tomorrow",
    status: "scheduled",
    recipients: 1247,
  },
];

export default function Notifications() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="mt-2 text-muted-foreground">
            View and manage all sent and scheduled notifications
          </p>
        </div>
        <Button className="gap-2">
          <Bell className="h-4 w-4" />
          Send Manual Notification
        </Button>
      </div>

      {/* Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Sent</p>
              <p className="mt-2 text-3xl font-bold">4,892</p>
            </div>
            <div className="rounded-lg bg-primary/10 p-3">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today</p>
              <p className="mt-2 text-3xl font-bold">234</p>
            </div>
            <div className="rounded-lg bg-secondary/10 p-3">
              <Check className="h-6 w-6 text-secondary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Scheduled</p>
              <p className="mt-2 text-3xl font-bold">12</p>
            </div>
            <div className="rounded-lg bg-primary/10 p-3">
              <Clock className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {/* TODO: API Integration Point - Replace mockNotifications with actual API call */}
        {/* Example: const { data: notifications } = useQuery('notifications', fetchNotifications) */}
        {mockNotifications.map((notification) => (
          <Card key={notification.id} className="p-6 transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-3">
                  <h3 className="text-lg font-semibold">{notification.title}</h3>
                  <Badge variant={notification.status === "sent" ? "default" : "secondary"}>
                    {notification.status}
                  </Badge>
                </div>
                <p className="mb-3 text-sm text-muted-foreground">{notification.message}</p>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {notification.timestamp}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {notification.recipients} recipients
                  </div>
                </div>
              </div>

              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

    </div>
  );
}
