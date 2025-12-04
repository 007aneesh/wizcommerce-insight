import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  Upload,
  X,
  Save,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useCatalogStore } from "@/store/catalogStore";
import { useSegmentsStore } from "@/store/segmentsStore";
import { apiClient, ApiError } from "@/lib/api";
import type { CollectionData } from "@/lib/types";

interface Campaign {
  id: number | string;
  name: string;
  type: string;
  status: string;
  description: string;
  lastTriggered?: string;
  emailCount?: number;
  config?: Record<string, any>;
}

interface CampaignEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: Campaign | null;
  onUpdate?: () => void;
}

const campaignTypes = [
  {
    id: "collection",
    label: "New Collection Launch",
    icon: Package,
    description: "Notify buyers when new product collections are launched",
  },
  {
    id: "scheduled",
    label: "Scheduled Notification",
    icon: Calendar,
    description: "Send regular interval notifications to buyer segments",
  },
  {
    id: "event",
    label: "Event Campaign",
    icon: Zap,
    description: "Campaign based on specific buyer or product events",
  },
  {
    id: "cart",
    label: "Abandoned Cart",
    icon: ShoppingCart,
    description: "Alert buyers about abandoned carts with stock updates",
  },
  {
    id: "product",
    label: "Product Update",
    icon: Bell,
    description: "Notify buyers when watched products are updated",
  },
];

export function CampaignEditModal({ 
  open, 
  onOpenChange, 
  campaign,
  onUpdate 
}: CampaignEditModalProps) {
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [collections, setCollections] = useState<CollectionData[]>([]);
  const [isLoadingCollections, setIsLoadingCollections] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string>("");
  const [posterImage, setPosterImage] = useState<File | null>(null);
  const [posterImagePreview, setPosterImagePreview] = useState<string>("");
  const [formData, setFormData] = useState<Record<string, any>>({});

  const { selectedCatalog } = useCatalogStore();
  const { getBuyerSegments } = useSegmentsStore();
  const selectedCampaignType = campaignTypes.find((t) => t.id === campaign?.type);
  const buyerSegments = getBuyerSegments();

  // Initialize form data when campaign changes
  useEffect(() => {
    if (campaign) {
      setIsActive(campaign.status === "active");
      setFormData({
        name: campaign.name || "",
        description: campaign.description || "",
        ...(campaign.config || {}),
      });
      
      // Set collection if it's a collection campaign
      if (campaign.type === "collection" && campaign.config?.collection_id) {
        setSelectedCollection(campaign.config.collection_id);
      }
      
      // Set poster image preview if exists
      if (campaign.config?.poster_image_url) {
        setPosterImagePreview(campaign.config.poster_image_url);
      }
    }
  }, [campaign]);

  // Fetch collections when collection campaign is selected
  useEffect(() => {
    const fetchCollections = async () => {
      if (campaign?.type === "collection" && selectedCatalog && collections.length === 0) {
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

    if (open && campaign?.type === "collection") {
      fetchCollections();
    }
  }, [campaign?.type, selectedCatalog, open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
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

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!campaign) return;

    setIsLoading(true);

    const campaignData = {
      id: campaign.id,
      name: formData.name,
      description: formData.description,
      status: isActive ? "active" : "inactive",
      type: campaign.type,
      config: {
        ...formData,
        collection_id: campaign.type === "collection" ? selectedCollection : undefined,
        poster_image: posterImage || undefined,
      },
    };

    // TODO: API Integration - PUT /api/campaigns/:id/update
    // await apiClient.updateCampaign(campaign.id, campaignData);
    
    setTimeout(() => {
      console.log("Updating campaign:", campaignData);
      toast.success("Campaign updated successfully!");
      setIsLoading(false);
      onOpenChange(false);
      if (onUpdate) {
        onUpdate();
      }
    }, 1000);
  };

  if (!campaign) return null;

  const Icon = selectedCampaignType?.icon || Package;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Edit Campaign</DialogTitle>
              <DialogDescription>
                Update campaign configuration and settings
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campaign Type Badge */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-2">
              <Icon className="h-3 w-3" />
              {selectedCampaignType?.label}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Campaign ID: {campaign.id}
            </span>
          </div>

          <Separator />

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Basic Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="edit-name">Campaign Name *</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Summer Collection Launch Campaign"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe what this campaign does and when it activates..."
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="edit-active">Active Status</Label>
                <p className="text-sm text-muted-foreground">
                  Enable this campaign to start sending emails
                </p>
              </div>
              <Switch
                id="edit-active"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>
          </div>

          <Separator />

          {/* Campaign-Specific Configuration */}
          <div className="space-y-4">
            <h3 className="font-semibold">Campaign Configuration</h3>
            
            {campaign.type === "collection" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="edit-collection_id">
                    Choose Collection <span className="text-destructive">*</span>
                  </Label>
                  <Select 
                    value={selectedCollection}
                    onValueChange={(value) => {
                      setSelectedCollection(value);
                      handleInputChange("collection_id", value);
                    }}
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
                  <Label htmlFor="edit-base_prompt">
                    Base Prompt <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="edit-base_prompt"
                    name="base_prompt"
                    value={formData.base_prompt || ""}
                    onChange={(e) => handleInputChange("base_prompt", e.target.value)}
                    placeholder="Enter the base prompt for AI-generated content..."
                    rows={4}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    This prompt will be used to generate personalized content for each buyer
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-poster_image">
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
                      {posterImage && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          {posterImage.name} ({(posterImage.size / 1024).toFixed(2)} KB)
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        id="edit-poster_image"
                        name="poster_image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="edit-poster_image"
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

            {campaign.type === "scheduled" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="edit-frequency">Frequency</Label>
                  <Select 
                    value={formData.frequency || ""}
                    onValueChange={(value) => handleInputChange("frequency", value)}
                  >
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
                  <Label htmlFor="edit-schedule">Schedule Time</Label>
                  <Input
                    id="edit-schedule"
                    name="schedule"
                    type="time"
                    value={formData.schedule || "09:00"}
                    onChange={(e) => handleInputChange("schedule", e.target.value)}
                  />
                </div>
              </>
            )}

            {campaign.type === "event" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="edit-event_type">Event Type</Label>
                  <Select 
                    value={formData.event_type || ""}
                    onValueChange={(value) => handleInputChange("event_type", value)}
                  >
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
                  <Label htmlFor="edit-conditions">Conditions (JSON)</Label>
                  <Textarea
                    id="edit-conditions"
                    name="conditions"
                    value={formData.conditions || ""}
                    onChange={(e) => handleInputChange("conditions", e.target.value)}
                    placeholder='{"price_threshold": 50, "stock_level": 10}'
                    rows={3}
                  />
                </div>
              </>
            )}

            {campaign.type === "cart" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="edit-cart_delay">Reminder Delay (hours)</Label>
                  <Input
                    id="edit-cart_delay"
                    name="delay"
                    type="number"
                    value={formData.delay || ""}
                    onChange={(e) => handleInputChange("delay", e.target.value)}
                    placeholder="24"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-stock_threshold">Stock Threshold</Label>
                  <Input
                    id="edit-stock_threshold"
                    name="stock_threshold"
                    type="number"
                    value={formData.stock_threshold || ""}
                    onChange={(e) => handleInputChange("stock_threshold", e.target.value)}
                    placeholder="5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-min_cart_value">Min Cart Value ($)</Label>
                  <Input
                    id="edit-min_cart_value"
                    name="min_cart_value"
                    type="number"
                    value={formData.min_cart_value || ""}
                    onChange={(e) => handleInputChange("min_cart_value", e.target.value)}
                    placeholder="50"
                  />
                </div>
              </>
            )}

            {campaign.type === "product" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="edit-product_ids">Product IDs (comma-separated)</Label>
                  <Input
                    id="edit-product_ids"
                    name="product_ids"
                    value={formData.product_ids || ""}
                    onChange={(e) => handleInputChange("product_ids", e.target.value)}
                    placeholder="e.g., PRD001, PRD002, PRD003"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-update_types">Update Types</Label>
                  <Select 
                    value={formData.update_types || ""}
                    onValueChange={(value) => handleInputChange("update_types", value)}
                  >
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
              <Label htmlFor="edit-target_segment">Target Segment</Label>
              <Select 
                value={formData.target_segment || ""}
                onValueChange={(value) => handleInputChange("target_segment", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select target segment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Buyers</SelectItem>
                  <SelectItem value="active">Active Buyers</SelectItem>
                  {buyerSegments.length > 0 && (
                    <>
                      {buyerSegments.map((segment) => (
                        <SelectItem key={segment.id} value={segment.id}>
                          {segment.name}
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {buyerSegments.length === 0 && (
                  <span>
                    No custom segments available.{" "}
                    <Link to="/segments" className="text-primary hover:underline">
                      Create segments
                    </Link>{" "}
                    to target specific buyer groups.
                  </span>
                )}
                {buyerSegments.length > 0 && "Select a custom buyer segment or use default options"}
              </p>
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
                  Connect to <code className="text-primary">PUT /api/campaigns/:id/update</code> to save campaign updates.
                </p>
              </div>
            </div>
          </Card>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

