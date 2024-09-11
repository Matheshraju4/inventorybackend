import express from "express";
import WooCommerceCRUD from "../Class/woocommerce";

export const woocommerce = express.Router();

// Create a new product
woocommerce.post("/create", async (req, res) => {
  try {
    const { storeUrl, consumerKey, consumerSecret, productDetails } = req.body;
    const wooCommerce = new WooCommerceCRUD(
      storeUrl,
      consumerKey,
      consumerSecret
    );

    const createdProduct = await wooCommerce.createProduct(productDetails);
    res.send({ success: true, product: createdProduct });
  } catch (error) {
    handleError(res, error);
  }
});

// Read a product by ID
woocommerce.get("/read/:id", async (req, res) => {
  try {
    const { storeUrl, consumerKey, consumerSecret } = req.body;
    const { id } = req.params;
    const wooCommerce = new WooCommerceCRUD(
      storeUrl,
      consumerKey,
      consumerSecret
    );

    const product = await wooCommerce.getProduct(parseInt(id));
    res.send({ success: true, product });
  } catch (error) {
    handleError(res, error);
  }
});

// Update an existing product
woocommerce.put("/update/:id", async (req, res) => {
  try {
    const { storeUrl, consumerKey, consumerSecret, productDetails } = req.body;
    const { id } = req.params;
    const wooCommerce = new WooCommerceCRUD(
      storeUrl,
      consumerKey,
      consumerSecret
    );

    const updatedProduct = await wooCommerce.updateProduct(
      parseInt(id),
      productDetails
    );
    res.send({ success: true, product: updatedProduct });
  } catch (error) {
    handleError(res, error);
  }
});

// Delete a product by ID
woocommerce.delete("/delete/:id", async (req, res) => {
  try {
    const { storeUrl, consumerKey, consumerSecret } = req.body;
    const { id } = req.params;
    const wooCommerce = new WooCommerceCRUD(
      storeUrl,
      consumerKey,
      consumerSecret
    );

    await wooCommerce.deleteProduct(parseInt(id));
    res.send({
      success: true,
      message: `Product with ID ${id} deleted successfully`,
    });
  } catch (error) {
    handleError(res, error);
  }
});

// List all products
woocommerce.get("/read-all", async (req, res) => {
  try {
    const { storeUrl, consumerKey, consumerSecret } = req.body;
    const wooCommerce = new WooCommerceCRUD(
      storeUrl,
      consumerKey,
      consumerSecret
    );

    const products = await wooCommerce.listProducts();
    res.send({ success: true, products });
  } catch (error) {
    handleError(res, error);
  }
});

// Error handling function
function handleError(res: express.Response, error: unknown) {
  if (error instanceof Error) {
    res.status(500).send({ success: false, error: error.message });
  } else {
    res
      .status(500)
      .send({ success: false, error: "An unknown error occurred." });
  }
}
