import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Package, 
  Calendar, 
  Zap, 
  ShoppingCart, 
  Bell,
  AlertCircle,
  Clock,
  Mail,
  Upload,
  X,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";
import { useCatalogStore } from "@/store/catalogStore";
import { apiClient, ApiError } from "@/lib/api";
import type { CollectionData } from "@/lib/types";

interface TriggerConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const triggerTypes = [
  {
    id: "collection",
    label: "New Collection Launch",
    icon: Package,
    description: "Notify buyers when new product collections are launched",
    fields: ["collection_id", "target_segment", "poster_image", "base_prompt"],
  },
  {
    id: "scheduled",
    label: "Scheduled Notification",
    icon: Calendar,
    description: "Send regular interval notifications to buyer segments",
    fields: ["schedule", "frequency", "target_segment"],
  },
  {
    id: "event",
    label: "Event Trigger",
    icon: Zap,
    description: "Trigger based on specific buyer or product events",
    fields: ["event_type", "conditions", "target_segment"],
  },
  {
    id: "cart",
    label: "Abandoned Cart",
    icon: ShoppingCart,
    description: "Alert buyers about abandoned carts with stock updates",
    fields: ["delay", "stock_threshold", "min_cart_value"],
  },
  {
    id: "product",
    label: "Product Update",
    icon: Bell,
    description: "Notify buyers when watched products are updated",
    fields: ["product_ids", "update_types", "target_segment"],
  },
];

export function TriggerConfigModal({ open, onOpenChange }: TriggerConfigModalProps) {
  const [selectedType, setSelectedType] = useState<string>("");
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [collections, setCollections] = useState<CollectionData[]>([]);
  const [isLoadingCollections, setIsLoadingCollections] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string>("");
  const [posterImage, setPosterImage] = useState<File | null>(null);
  const [posterImagePreview, setPosterImagePreview] = useState<string>("");

  const { selectedCatalog } = useCatalogStore();
  const selectedTriggerType = triggerTypes.find((t) => t.id === selectedType);

  // Fetch collections when collection trigger is selected
  useEffect(() => {
    const fetchCollections = async () => {
      if (selectedType === "collection" && selectedCatalog && collections.length === 0) {
        try {
          setIsLoadingCollections(true);
          const response = await apiClient.searchCollections(selectedCatalog.value);
          if (response.data) {
            setCollections(response.data);
          }
        } catch (error) {
          if (error instanceof ApiError) {
            toast.error("Failed to load collections");
          }
          console.error("Error fetching collections:", error);
        } finally {
          setIsLoadingCollections(false);
        }
      }
    };

    fetchCollections();
  }, [selectedType, selectedCatalog, collections.length]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload an image file");
        return;
      }

      setPosterImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPosterImage(null);
    setPosterImagePreview("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const triggerData = {
      type: selectedType,
      name: formData.get("name"),
      description: formData.get("description"),
      active: isActive,
      // Additional fields based on trigger type
      config: Object.fromEntries(formData.entries()),
    };

    // TODO: API Integration - POST /api/triggers/create
    setTimeout(() => {
      console.log("Creating trigger:", triggerData);
      toast.success("Trigger created successfully!");
      setIsLoading(false);
      onOpenChange(false);
      // Reset form
      setSelectedType("");
      setIsActive(true);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Trigger</DialogTitle>
            <DialogDescription>
              Configure automated triggers for your buyers based on products and events
            </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trigger Type Selection */}
          <div className="space-y-3">
            <Label>Trigger Type *</Label>
            <div className="grid gap-3 sm:grid-cols-2">
              {triggerTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedType(type.id)}
                    className={`flex items-start gap-3 rounded-lg border-2 p-4 text-left transition-all hover:shadow-md ${
                      selectedType === type.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{type.label}</h4>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {type.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedType && (
            <>
              <Separator />

              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold">Basic Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Trigger Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Summer Collection Launch Notification"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe what this trigger does and when it activates..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="active">Active Status</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable this trigger to start sending notifications
                    </p>
                  </div>
                  <Switch
                    id="active"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                </div>
              </div>

              <Separator />

              {/* Trigger-Specific Configuration */}
              <div className="space-y-4">
                <h3 className="font-semibold">Trigger Configuration</h3>
                
                {selectedType === "collection" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="collection_id">
                        Choose Collection <span className="text-destructive">*</span>
                      </Label>
                      <Select 
                        name="collection_id" 
                        value={selectedCollection}
                        onValueChange={setSelectedCollection}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={isLoadingCollections ? "Loading collections..." : "Select a collection"} />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingCollections ? (
                            <SelectItem value="loading" disabled>Loading...</SelectItem>
                          ) : collections.length === 0 ? (
                            <SelectItem value="none" disabled>No collections available</SelectItem>
                          ) : (
                            collections.map((collection) => (
                              <SelectItem key={collection.id} value={collection.id}>
                                <div className="flex items-center gap-2">
                                  <Package className="h-4 w-4" />
                                  <span>{collection.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    ({collection.product_count} products)
                                  </span>
                                </div>
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Select the collection to launch
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="base_prompt">
                        Base Prompt <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="base_prompt"
                        name="base_prompt"
                        placeholder="Enter the base prompt for AI-generated content..."
                        rows={4}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        This prompt will be used to generate personalized content for each buyer
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="poster_image">
                        Collection Poster Image
                      </Label>
                      {posterImagePreview ? (
                        <div className="relative">
                          <div className="relative rounded-lg border-2 border-dashed border-border overflow-hidden">
                            <img
                              src={posterImagePreview}
                              alt="Poster preview"
                              className="w-full h-48 object-cover"
                            />
                            <button
                              type="button"
                              onClick={removeImage}
                              className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {posterImage?.name} ({(posterImage!.size / 1024).toFixed(2)} KB)
                          </p>
                        </div>
                      ) : (
                        <div className="relative">
                          <input
                            type="file"
                            id="poster_image"
                            name="poster_image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                          <label
                            htmlFor="poster_image"
                            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                              <p className="mb-2 text-sm text-muted-foreground">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-muted-foreground">
                                PNG, JPG or WEBP (MAX. 5MB)
                              </p>
                            </div>
                          </label>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Upload a poster image for the collection launch (optional)
                      </p>
                    </div>
                  </>
                )}

                {selectedType === "scheduled" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="frequency">Frequency</Label>
                      <Select name="frequency">
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="biweekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="schedule">Schedule Time</Label>
                      <Input
                        id="schedule"
                        name="schedule"
                        type="time"
                        defaultValue="09:00"
                      />
                    </div>
                  </>
                )}

                {selectedType === "event" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="event_type">Event Type</Label>
                      <Select name="event_type">
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="price_drop">Price Drop</SelectItem>
                          <SelectItem value="back_in_stock">Back in Stock</SelectItem>
                          <SelectItem value="new_arrival">New Arrival</SelectItem>
                          <SelectItem value="low_stock">Low Stock Alert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="conditions">Conditions (JSON)</Label>
                      <Textarea
                        id="conditions"
                        name="conditions"
                        placeholder='{"price_threshold": 50, "stock_level": 10}'
                        rows={3}
                      />
                    </div>
                  </>
                )}

                {selectedType === "cart" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="cart_delay">Reminder Delay (hours)</Label>
                      <Input
                        id="cart_delay"
                        name="delay"
                        type="number"
                        placeholder="24"
                        defaultValue="24"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock_threshold">Stock Threshold</Label>
                      <Input
                        id="stock_threshold"
                        name="stock_threshold"
                        type="number"
                        placeholder="5"
                        defaultValue="5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="min_cart_value">Min Cart Value ($)</Label>
                      <Input
                        id="min_cart_value"
                        name="min_cart_value"
                        type="number"
                        placeholder="50"
                        defaultValue="0"
                      />
                    </div>
                  </>
                )}

                {selectedType === "product" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="product_ids">Product IDs (comma-separated)</Label>
                      <Input
                        id="product_ids"
                        name="product_ids"
                        placeholder="e.g., PRD001, PRD002, PRD003"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="update_types">Update Types</Label>
                      <Select name="update_types">
                        <SelectTrigger>
                          <SelectValue placeholder="Select update types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="price">Price Changes</SelectItem>
                          <SelectItem value="stock">Stock Updates</SelectItem>
                          <SelectItem value="description">Description Updates</SelectItem>
                          <SelectItem value="all">All Updates</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {/* Target Segment */}
                <div className="space-y-2">
                  <Label htmlFor="target_segment">Target Segment</Label>
                  <Select name="target_segment">
                    <SelectTrigger>
                      <SelectValue placeholder="Select target segment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Buyers</SelectItem>
                      <SelectItem value="active">Active Buyers</SelectItem>
                      <SelectItem value="vip">VIP Buyers</SelectItem>
                      <SelectItem value="inactive">Inactive Buyers</SelectItem>
                      <SelectItem value="custom">Custom Segment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

                <Separator />

              {/* API Integration Notice */}
              <Card className="border-dashed bg-muted/30 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-medium">API Integration Required</p>
                    <p className="text-xs text-muted-foreground">
                      Connect to <code className="text-primary">POST /api/triggers/create</code> to save trigger configurations.
                      Required buyer data: name, past orders, preferences.
                    </p>
                  </div>
                </div>
              </Card>
            </>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedType || isLoading}>
              {isLoading ? "Creating..." : "Create Trigger"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
