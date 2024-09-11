// adjust the path as needed

import ShopifyCRUD from "../shopify";

const shopify = new ShopifyCRUD("your-shop-name", "your-access-token");

// Create a new product
const newProduct = {
  title: "New Product",
  body_html: "<strong>Good product!</strong>",
  vendor: "Vendor Name",
  product_type: "Widget",
  tags: ["tag1", "tag2"],
};

shopify
  .createProduct(newProduct)
  .then((product) => console.log("Created product:", product))
  .catch((err) => console.error("Error:", err));

// Get a product by ID
const productId = 1234567890; // replace with a valid product ID

shopify
  .getProduct(productId)
  .then((product) => console.log("Fetched product:", product))
  .catch((err) => console.error("Error:", err));

// Update a product
const updatedProductData = {
  title: "Updated Product Title",
};

shopify
  .updateProduct(productId, updatedProductData)
  .then((product) => console.log("Updated product:", product))
  .catch((err) => console.error("Error:", err));

// Delete a product
shopify
  .deleteProduct(productId)
  .then(() => console.log("Deleted product"))
  .catch((err) => console.error("Error:", err));

// List all products
shopify
  .listProducts()
  .then((products) => console.log("All products:", products))
  .catch((err) => console.error("Error:", err));
