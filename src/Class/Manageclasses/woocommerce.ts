// // adjust the path as needed

// import WooCommerceCRUD from "../woocommerce";

// const wooCommerce = new WooCommerceCRUD(
//   "https://yourstore.com",
//   "your-consumer-key",
//   "your-consumer-secret"
// );

// // Create a new product
// const newProduct = {
//   name: "New Product",
//   type: "simple",
//   regular_price: "19.99",
//   description: "This is a new product.",
//   short_description: "A short description.",
//   categories: [{ id: 1 }],
//   images: [{ src: "http://example.com/wp-content/uploads/2020/01/sample.jpg" }],
// };

// wooCommerce
//   .createProduct(newProduct)
//   .then((product) => console.log("Created product:", product))
//   .catch((err) => console.error("Error:", err));

// // Get a product by ID
// const productId = 1234; // replace with a valid product ID

// wooCommerce
//   .getProduct(productId)
//   .then((product) => console.log("Fetched product:", product))
//   .catch((err) => console.error("Error:", err));

// // Update a product
// const updatedProductData = {
//   name: "Updated Product Title",

//   type: "string",
//   regular_price: "string",
// };

// wooCommerce
//   .updateProduct(productId, updatedProductData)
//   .then((product) => console.log("Updated product:", product))
//   .catch((err) => console.error("Error:", err));

// // Delete a product
// wooCommerce
//   .deleteProduct(productId)
//   .then(() => console.log("Deleted product"))
//   .catch((err) => console.error("Error:", err));

// // List all products
// wooCommerce
//   .listProducts()
//   .then((products) => console.log("All products:", products))
//   .catch((err) => console.error("Error:", err));
