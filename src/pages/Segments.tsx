import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Package,
  Search,
  Loader2,
  AlertCircle,
  Save,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useSegmentsStore, type Segment } from "@/store/segmentsStore";

export default function Segments() {
  const [activeTab, setActiveTab] = useState<"buyer" | "product">("buyer");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    buyerSegments,
    productSegments,
    addBuyerSegment,
    addProductSegment,
    updateBuyerSegment,
    updateProductSegment,
    deleteBuyerSegment,
    deleteProductSegment,
  } = useSegmentsStore();

  const currentSegments = activeTab === "buyer" ? buyerSegments : productSegments;

  const filteredSegments = currentSegments.filter((segment) =>
    segment.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setSelectedSegment(null);
    setIsCreateModalOpen(true);
  };

  const handleEdit = (segment: Segment) => {
    setSelectedSegment(segment);
    setIsEditModalOpen(true);
  };

  const handleDelete = (segment: Segment) => {
    setSelectedSegment(segment);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedSegment) return;

    setIsLoading(true);
    try {
      // TODO: API Integration - DELETE /api/segments/:id
      // await apiClient.deleteSegment(selectedSegment.id);

      if (selectedSegment.type === "buyer") {
        deleteBuyerSegment(selectedSegment.id);
      } else {
        deleteProductSegment(selectedSegment.id);
      }

      toast.success("Segment deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedSegment(null);
    } catch (error) {
      toast.error("Failed to delete segment");
      console.error("Error deleting segment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Segments</h1>
          <p className="mt-2 text-muted-foreground">
            Create and manage buyer and product segments for targeted campaigns
          </p>
        </div>
        <Button className="gap-2" onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          Create Segment
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "buyer" | "product")}>
        <TabsList>
          <TabsTrigger value="buyer" className="gap-2">
            <Users className="h-4 w-4" />
            Buyer Segments
          </TabsTrigger>
          <TabsTrigger value="product" className="gap-2">
            <Package className="h-4 w-4" />
            Product Segments
          </TabsTrigger>
        </TabsList>

        {/* Buyer Segments Tab */}
        <TabsContent value="buyer" className="space-y-4">
          <Card className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search buyer segments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </Card>

          {filteredSegments.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No buyer segments</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                {searchQuery
                  ? "No segments match your search"
                  : "Create your first buyer segment to get started"}
              </p>
              {!searchQuery && (
                <Button onClick={handleCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Buyer Segment
                </Button>
              )}
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredSegments.map((segment) => (
                <Card key={segment.id} className="p-6 transition-all hover:shadow-lg">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{segment.name}</h3>
                        <Badge variant="secondary">Buyer</Badge>
                      </div>
                      {segment.description && (
                        <p className="text-sm text-muted-foreground">
                          {segment.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-4 flex items-center gap-4 text-sm">
                    {segment.member_count !== undefined && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {segment.member_count} members
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(segment)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(segment)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Product Segments Tab */}
        <TabsContent value="product" className="space-y-4">
          <Card className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search product segments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </Card>

          {filteredSegments.length === 0 ? (
            <Card className="p-12 text-center">
              <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No product segments</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                {searchQuery
                  ? "No segments match your search"
                  : "Create your first product segment to get started"}
              </p>
              {!searchQuery && (
                <Button onClick={handleCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Product Segment
                </Button>
              )}
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredSegments.map((segment) => (
                <Card key={segment.id} className="p-6 transition-all hover:shadow-lg">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{segment.name}</h3>
                        <Badge variant="secondary">Product</Badge>
                      </div>
                      {segment.description && (
                        <p className="text-sm text-muted-foreground">
                          {segment.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-4 flex items-center gap-4 text-sm">
                    {segment.member_count !== undefined && (
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {segment.member_count} products
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(segment)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(segment)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create/Edit Modal */}
      <SegmentModal
        open={isCreateModalOpen || isEditModalOpen}
        onOpenChange={(open) => {
          setIsCreateModalOpen(open);
          setIsEditModalOpen(open);
          if (!open) setSelectedSegment(null);
        }}
        segment={selectedSegment}
        type={activeTab}
        isEdit={!!selectedSegment}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Segment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedSegment?.name}"? This action
              cannot be undone and may affect campaigns using this segment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface SegmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  segment: Segment | null;
  type: "buyer" | "product";
  isEdit: boolean;
}

function SegmentModal({
  open,
  onOpenChange,
  segment,
  type,
  isEdit,
}: SegmentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    criteria: {} as Record<string, any>,
  });
  const [isLoading, setIsLoading] = useState(false);

  const { addBuyerSegment, addProductSegment, updateBuyerSegment, updateProductSegment } =
    useSegmentsStore();

  // Initialize form data when segment changes
  useEffect(() => {
    if (open) {
      if (segment) {
        setFormData({
          name: segment.name || "",
          description: segment.description || "",
          criteria: segment.criteria || {},
        });
      } else {
        setFormData({
          name: "",
          description: "",
          criteria: {},
        });
      }
    }
  }, [open, segment]);

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const segmentData: Segment = {
        id: segment?.id || `seg_${Date.now()}`,
        name: formData.name,
        description: formData.description,
        type,
        criteria: formData.criteria,
        member_count: 0,
        created_at: segment?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (isEdit && segment) {
        // TODO: API Integration - PUT /api/segments/:id
        // await apiClient.updateSegment(segment.id, segmentData);

        if (type === "buyer") {
          updateBuyerSegment(segment.id, segmentData);
        } else {
          updateProductSegment(segment.id, segmentData);
        }

        toast.success("Segment updated successfully");
      } else {
        // TODO: API Integration - POST /api/segments
        // await apiClient.createSegment(segmentData);

        if (type === "buyer") {
          addBuyerSegment(segmentData);
        } else {
          addProductSegment(segmentData);
        }

        toast.success("Segment created successfully");
      }

      onOpenChange(false);
      setFormData({ name: "", description: "", criteria: {} });
    } catch (error) {
      toast.error(isEdit ? "Failed to update segment" : "Failed to create segment");
      console.error("Error saving segment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isEdit ? "Edit Segment" : `Create ${type === "buyer" ? "Buyer" : "Product"} Segment`}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update segment details and criteria"
              : `Create a new ${type === "buyer" ? "buyer" : "product"} segment for targeted campaigns`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="segment-name">
                Segment Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="segment-name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder={`e.g., ${type === "buyer" ? "VIP Buyers" : "Best Sellers"}`}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="segment-description">Description</Label>
              <Textarea
                id="segment-description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe this segment and its purpose..."
                rows={3}
              />
            </div>

            {/* Segment Criteria Section */}
            <div className="space-y-4 rounded-lg border border-border p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Segment Criteria</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {type === "buyer"
                  ? "Define criteria for buyer segmentation (e.g., order value, purchase frequency, location)"
                  : "Define criteria for product segmentation (e.g., category, price range, stock level)"}
              </p>
              <Card className="border-dashed bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground">
                  Criteria configuration will be available after API integration. For now, segments
                  can be created and used in campaigns.
                </p>
              </Card>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.name}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEdit ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEdit ? "Save Changes" : "Create Segment"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

