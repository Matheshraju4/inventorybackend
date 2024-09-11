interface ShopifyProduct {
  id: number;
  product_id: number;
  title: string;
  price: string;
  position: number;
  inventory_policy: string;
  compare_at_price: string | null;
  option1: string;
  option2: string | null;
  option3: string | null;
  created_at: string;
  updated_at: string;
  taxable: boolean;
  barcode: string | null;
  fulfillment_service: string;
  grams: number;
  inventory_management: string | null;
  requires_shipping: boolean;
  sku: string;
  weight: number;
  weight_unit: string;
  inventory_item_id: number;
  inventory_quantity: number;
  old_inventory_quantity: number;
  admin_graphql_api_id: string;
  image_id: string | null;
}

interface ProductOption {
  id: number;
  product_id: number;
  name: string;
  position: number;
  values: string[];
}

interface Product {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  created_at: string;
  handle: string;
  updated_at: string;
  published_at: string | null;
  template_suffix: string | null;
  published_scope: string;
  tags: string;
  status: string;
  admin_graphql_api_id: string;
  variants: ShopifyProduct[];
  options: ProductOption[];
  images: any[]; // Since images are empty, you might want to define a more specific type if they are expected to have a structure.
  image: string | null;
}

interface WoocommerceProductImage {
  id: number;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  src: string;
  name: string;
  alt: string;
}

interface WoocommerceProductCategory {
  id: number;
  name: string;
  slug: string;
}

interface WoocommerceProductMetaData {
  id: number;
  key: string;
  value: string;
}

interface WoocommerceProductDimensions {
  length: string;
  width: string;
  height: string;
}

interface WoocommerceProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  type: string;
  status: string;
  featured: boolean;
  catalog_visibility: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string | null;
  date_on_sale_from: string | null;
  date_on_sale_from_gmt: string | null;
  date_on_sale_to: string | null;
  date_on_sale_to_gmt: string | null;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  virtual: boolean;
  downloadable: boolean;
  downloads: any[]; // Assuming downloads are an array, structure not provided.
  download_limit: number;
  download_expiry: number;
  external_url: string;
  button_text: string;
  tax_status: string;
  tax_class: string;
  manage_stock: boolean;
  stock_quantity: number | null;
  backorders: string;
  backorders_allowed: boolean;
  backordered: boolean;
  low_stock_amount: number | null;
  sold_individually: boolean;
  weight: string;
  dimensions: WoocommerceProductDimensions;
  shipping_required: boolean;
  shipping_taxable: boolean;
  shipping_class: string;
  shipping_class_id: number;
  reviews_allowed: boolean;
  average_rating: string;
  rating_count: number;
  upsell_ids: number[];
  cross_sell_ids: number[];
  parent_id: number;
  purchase_note: string;
  categories: WoocommerceProductCategory[];
  tags: any[]; // Assuming tags are an array, structure not provided.
  images: WoocommerceProductImage[];
  attributes: any[]; // Assuming attributes are an array, structure not provided.
  default_attributes: any[]; // Assuming default_attributes are an array, structure not provided.
  variations: any[]; // Assuming variations are an array, structure not provided.
  grouped_products: any[]; // Assuming grouped_products are an array, structure not provided.
  menu_order: number;
  price_html: string;
  related_ids: number[];
  meta_data: WoocommerceProductMetaData[];
  stock_status: string;
  has_options: boolean;
  post_password: string;
  permalink_template: string;
  generated_slug: string;
  jetpack_sharing_enabled: boolean;
  _links: {
    self: { href: string }[];
    collection: { href: string }[];
  };
}
