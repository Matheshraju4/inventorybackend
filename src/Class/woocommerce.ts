import axios, { AxiosResponse } from "axios";

class WooCommerceCRUD {
  private baseUrl: string;
  private consumerKey: string;
  private consumerSecret: string;

  constructor(storeUrl: string, consumerKey: string, consumerSecret: string) {
    this.baseUrl = `${storeUrl}/wp-json/wc/v3`;
    this.consumerKey = consumerKey;
    this.consumerSecret = consumerSecret;
  }

  // Create a new product
  async createProduct(productData: any): Promise<WoocommerceProduct> {
    try {
      const response: AxiosResponse<WoocommerceProduct> = await axios.post(
        `${this.baseUrl}/products`,
        productData,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Read (get) a product by ID
  async getProduct(productId: number): Promise<WoocommerceProduct> {
    try {
      const response: AxiosResponse<WoocommerceProduct> = await axios.get(
        `${this.baseUrl}/products/${productId}`,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Update an existing product
  async updateProduct(productId: number, updatedData: any): Promise<any> {
    try {
      const response: AxiosResponse<any> = await axios.put(
        `${this.baseUrl}/products/${productId}`,
        updatedData,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Delete a product by ID
  async deleteProduct(productId: number): Promise<void> {
    try {
      await axios.delete(
        `${this.baseUrl}/products/${productId}`,
        this.getAuthHeaders()
      );
      console.log(`Product with ID ${productId} deleted successfully`);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // List all products
  async listProducts(): Promise<WoocommerceProduct[]> {
    try {
      const response: AxiosResponse<WoocommerceProduct[]> = await axios.get(
        `${this.baseUrl}/products`,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Helper method to get authentication headers
  private getAuthHeaders() {
    return {
      auth: {
        username: this.consumerKey,
        password: this.consumerSecret,
      },
      headers: {
        "Content-Type": "application/json",
      },
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

export default WooCommerceCRUD;
