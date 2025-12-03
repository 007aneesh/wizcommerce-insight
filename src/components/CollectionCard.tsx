import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import type { CollectionData } from "@/lib/types";

interface CollectionCardProps {
  collection: CollectionData;
  onClick?: () => void;
}

export const CollectionCard = ({ collection, onClick }: CollectionCardProps) => {
  // Get thumbnail image
  const thumbnailMedia = collection.media.find(m => m.view_type === 'thumbnail');
  const thumbnailUrl = thumbnailMedia?.url || '';

  return (
    <Card
      className="group relative overflow-hidden cursor-pointer transition-all hover:shadow-lg"
      onClick={onClick}
    >
      {/* Background Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={collection.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="h-16 w-16 text-muted-foreground/50" />
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Collection Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white drop-shadow-lg">
            {collection.name}
          </h3>
        </div>
      </div>

      {/* Collection Info */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Package className="h-4 w-4" />
            <span>{collection.product_count} products</span>
          </div>
          {/* {collection.priority > 0 && (
            <Badge variant="secondary">Priority: {collection.priority}</Badge>
          )} */}
        </div>
      </div>
    </Card>
  );
};

