import axios, { AxiosResponse } from "axios";

interface Product {
  id?: number;
  title: string;
  body_html?: string;
  vendor?: string;
  product_type?: string;
  tags?: string[];
  [key: string]: any;
}

interface ShopifyResponse<T> {
  product: T;
}

interface ShopifyListResponse<T> {
  products: T[];
}

class ShopifyCRUD {
  private shopName: string;
  private accessToken: string;
  private baseUrl: string;

  constructor(shopName: string, accessToken: string) {
    this.shopName = shopName;
    this.accessToken = accessToken;
    this.baseUrl = `https://${this.shopName}.myshopify.com/admin/api/2023-07`;
  }

  // Create a new product
  async createProduct(productData: any): Promise<any> {
    try {
      const response: AxiosResponse<ShopifyResponse<ShopifyProduct>> =
        await axios.post(
          `${this.baseUrl}/products.json`,
          { product: productData },
          { headers: this.getHeaders() }
        );
      return response.data.product;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Read (get) a product by ID
  async getProduct(productId: number): Promise<ShopifyProduct> {
    try {
      const response: AxiosResponse<ShopifyResponse<ShopifyProduct>> =
        await axios.get(`${this.baseUrl}/products/${productId}.json`, {
          headers: this.getHeaders(),
        });
      return response.data.product;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Update an existing product
  async updateProduct(productId: number, updatedData: Product): Promise<any> {
    try {
      const response: AxiosResponse<ShopifyResponse<ShopifyProduct>> =
        await axios.put(
          `${this.baseUrl}/products/${productId}.json`,
          { product: updatedData },
          { headers: this.getHeaders() }
        );
      return response.data.product;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Delete a product by ID
  async deleteProduct(productId: number): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/products/${productId}.json`, {
        headers: this.getHeaders(),
      });
      console.log(`Product with ID ${productId} deleted successfully`);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // List all products
  async listProducts(): Promise<any[]> {
    try {
      const response: AxiosResponse<ShopifyListResponse<ShopifyProduct>> =
        await axios.get(`${this.baseUrl}/products.json`, {
          headers: this.getHeaders(),
        });
      return response.data.products;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Get the headers required for authentication
  private getHeaders() {
    return {
      "X-Shopify-Access-Token": this.accessToken,
      "Content-Type": "application/json",
    };
  }

  // Handle error properly
  private handleError(error: unknown): void {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("General error:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
  }
}

export default ShopifyCRUD;
