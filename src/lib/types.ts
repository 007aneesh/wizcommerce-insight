// Type definitions for WizCommerce platform
// TODO: Sync these types with your backend API schemas

// Buyer API Types
export interface BuyerOrderDetails {
  Quote: number;
  Orders: number;
  Drafts: number;
}

export interface BuyerHit {
  id: string;
  buyer_name: string;
  marked_buyer_name: string;
  system_id: string;
  reference_id: string;
  location: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  total_cart_items: number;
  total_carts: number;
  revenue_by_sales: number;
  order_details: BuyerOrderDetails;
  [key: string]: unknown; // For dynamic attributes
}

export interface BuyerSearchRequest {
  search: string;
  filters: {
    id: string[];
  };
  sort: unknown[];
  aggregate: boolean;
  page_number: number;
  page_size: number;
  exclude_ids: string[];
}

export interface BuyerSearchResponse {
  message: string;
  status_code: number;
  success: boolean;
  data: {
    hits: BuyerHit[];
    facets: Record<string, unknown>;
    nbPages: number;
    nbHits: number;
    page: number;
    hitsPerPage: number;
  };
  paginator: {
    nbPages: number;
    nbHits: number;
  };
}

// Order/Document Search Types
export interface SortModel {
  colId: string;
  sort: 'asc' | 'desc';
}

export interface FilterModel {
  created_at_milliseconds?: {
    filterType: 'date';
    type: 'inRange';
    filter: number | null;
    filterTo: number | null;
  };
  buyer_id?: {
    filterType: 'text';
    type: 'equals';
    filter: string;
  };
  type?: {
    filterType: 'text';
    type: 'equals';
    filter: string;
    filterTo: null;
  };
  [key: string]: unknown;
}

export interface OrderSearchRequest {
  startRow: number;
  endRow: number;
  sortModel: SortModel[];
  filterModel: FilterModel;
}

export interface OrderData {
  id: string;
  order_id?: string;
  order_value?: number;
  created_on?: string;
  created_at?: string;
  sales_rep_name?: string;
  sales_rep_email?: string;
  email?: string;
  [key: string]: unknown; // For other fields that might be present
}

export interface OrderSearchResponse {
  success: boolean;
  rows: OrderData[];
  lastRow?: number;
  [key: string]: unknown; // For other response fields
}

// Abandoned Cart Types
export interface AbandonedCartFilterModel {
  customer_name?: {
    filterType: 'text';
    type: 'contains';
    filter: string;
  };
  [key: string]: unknown;
}

export interface AbandonedCartSearchRequest {
  startRow: number;
  endRow: number;
  sortModel: SortModel[];
  filterModel: AbandonedCartFilterModel;
}

export interface AbandonedCartData {
  id: string;
  tenant_id: string;
  customer_name: string;
  customer_id: string;
  status: string;
  cart_id: string;
  cart_total: number;
  document_id: string | null;
  website_user_id: string;
  comment: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  created_at_milliseconds: number;
  updated_at_milliseconds: number;
  website_user_name: string;
  website_user_email: string;
  abandoned_cart_status: string;
  website_user_phone: string;
  total_skus: number;
  total_units: number;
  sales_reps: string[];
  customer_info: {
    label: string;
    value: string;
  };
  website_user_info: {
    label: string;
    value: string;
  };
  [key: string]: unknown;
}

export interface AbandonedCartSearchResponse {
  total: number;
  data: AbandonedCartData[];
  [key: string]: unknown;
}

// Cart Detail Types
export interface CartDetailRequest {
  cart_id: string;
  reference_user_id: string;
}

export interface CartProduct {
  id: string;
  product_id?: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  units?: number;
  image?: string;
  image_url?: string;
  inventory_status?: string;
  stock?: number;
  [key: string]: unknown;
}

export interface CartDetailResponse {
  cart_id: string;
  cart_total: number;
  total_skus: number;
  total_units: number;
  status: string;
  customer_name?: string;
  website_user_name?: string;
  website_user_email?: string;
  website_user_phone?: string;
  created_at?: string;
  updated_at?: string;
  products?: CartProduct[];
  items?: CartProduct[];
  [key: string]: unknown;
}

// Catalog Types
export interface Catalog {
  value: string;
  label: string;
  is_default: boolean;
}

export interface CatalogListResponse {
  message: string;
  status_code: number;
  success: boolean;
  data: Catalog[];
  paginator: Record<string, unknown>;
}

// Collection Types
export interface CollectionMedia {
  type: 'image' | string;
  view_type: 'thumbnail' | 'banner' | string;
  url: string;
}

export interface CollectionData {
  id: string;
  name: string;
  priority: number;
  media: CollectionMedia[];
  website_display_setting: unknown | null;
  product_count: number;
  attributes: unknown[];
}

export interface CollectionSearchResponse {
  message?: string;
  status_code?: number;
  success?: boolean;
  data: CollectionData[];
  [key: string]: unknown;
}

// Legacy Buyer interface (for backward compatibility if needed)
export interface Buyer {
  id: number | string;
  name: string;
  email: string;
  company?: string;
  totalOrders: number;
  avgOrderValue: string;
  lastOrder: string;
  status: "active" | "inactive" | "suspended";
  bestSellers?: string[];
  trendingItems?: string[];
  preferences?: BuyerPreferences;
}

export interface BuyerPreferences {
  emailNotifications: boolean;
  productUpdates: boolean;
  collectionLaunches: boolean;
  abandonedCartReminders: boolean;
  watchedProducts: string[];
}

export interface Order {
  id: number | string;
  buyerId: number | string;
  items: OrderLineItem[];
  totalValue: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface OrderLineItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  sku?: string;
}

export interface Trigger {
  id: number | string;
  name: string;
  type: "collection" | "scheduled" | "event" | "cart" | "product";
  status: "active" | "inactive" | "paused";
  description: string;
  lastTriggered?: string;
  triggerCount: number;
  config?: TriggerConfig;
}

export interface TriggerConfig {
  schedule?: string; // Cron expression for scheduled triggers
  eventType?: string;
  conditions?: Record<string, any>;
  emailTemplate?: string;
  targetBuyers?: "all" | "specific" | "segment";
  buyerIds?: (number | string)[];
}

export interface AbandonedCart {
  id: number | string;
  buyerId: number | string;
  buyerName: string;
  buyerEmail: string;
  cartValue: string;
  itemCount: number;
  abandonedAt: string;
  lastUpdate: string;
  priority: "high" | "medium" | "low";
  items: CartItem[];
}

export interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  stock: string;
  sku?: string;
}

export interface Notification {
  id: number | string;
  type: "collection" | "cart" | "event" | "scheduled" | "manual";
  title: string;
  message: string;
  timestamp: string;
  status: "sent" | "scheduled" | "failed" | "pending";
  recipients: number;
  deliveryRate?: number;
  openRate?: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category?: string;
  imageUrl?: string;
  description?: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  products: Product[];
  launchDate: string;
  status: "draft" | "active" | "archived";
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/*
 * API Integration Points
 * 
 * The following endpoints should be implemented in your backend:
 * 
 * Buyers:
 * - GET /api/buyers - Fetch all buyers with pagination
 * - GET /api/buyers/:id - Fetch single buyer details
 * - GET /api/buyers/:id/orders - Fetch buyer's order history (50-100 line items)
 * - GET /api/buyers/:id/best-sellers - Fetch buyer's best selling products
 * - GET /api/buyers/:id/trending - Fetch trending products for buyer
 * - GET /api/buyers/:id/similar-products - Fetch similar products to past orders
 * - GET /api/buyers/:id/frequently-bought-together - Fetch frequently bought together items
 * - PUT /api/buyers/:id/preferences - Update buyer notification preferences
 * 
 * Triggers:
 * - GET /api/triggers - Fetch all triggers
 * - POST /api/triggers - Create new trigger
 * - PUT /api/triggers/:id - Update trigger
 * - DELETE /api/triggers/:id - Delete trigger
 * - POST /api/triggers/:id/execute - Manually execute trigger
 * - POST /api/triggers/collection-launch - Trigger for new collection
 * - POST /api/triggers/scheduled-email - Regular interval emails
 * - POST /api/triggers/event - Event-based triggers
 * - POST /api/triggers/abandoned-cart - Cart abandonment alerts
 * - POST /api/triggers/product-update - Product update notifications
 * 
 * Abandoned Carts:
 * - GET /api/carts/abandoned - Fetch abandoned carts (top 5 by default)
 * - GET /api/carts/:id/items - Get cart items with real-time stock levels
 * - POST /api/notifications/cart-reminder - Send cart reminder emails
 * - GET /api/products/:id/stock - Real-time stock updates
 * 
 * Notifications:
 * - GET /api/notifications - Fetch notification history
 * - POST /api/notifications/send - Send manual notification
 * - GET /api/notifications/:id/status - Check delivery status
 * - GET /api/notifications/stats - Get notification statistics
 * 
 * Analytics:
 * - GET /api/analytics/overview - Dashboard overview stats
 * - GET /api/analytics/buyers - Buyer behavior analytics
 * - GET /api/analytics/products - Product performance metrics
 * - GET /api/analytics/trends - Market trends and patterns
 * 
 * Products & Collections:
 * - GET /api/products - Fetch all products
 * - GET /api/products/:id - Fetch single product
 * - GET /api/collections - Fetch all collections
 * - POST /api/collections - Create new collection
 */
