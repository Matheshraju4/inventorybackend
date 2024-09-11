import express from "express";
import ShopifyCRUD from "../Class/shopify";

export const shopify = express.Router();

// Create a new product
shopify.post("/create", async (req, res) => {
  try {
    const { shopifyCred, productDetails } = req.body;
    if (!shopifyCred || !shopifyCred.ShopName || !shopifyCred.accessToken) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid Shopify credentials." });
    }

    const shopifyAll = new ShopifyCRUD(
      shopifyCred.ShopName,
      shopifyCred.accessToken
    );

    const createdProduct = await shopifyAll.createProduct(productDetails);
    res.send({ success: true, product: createdProduct });
  } catch (error) {
    handleError(res, error);
  }
});

// Update an existing product
shopify.put("/update/:id", async (req, res) => {
  try {
    const { shopifyCred, productDetails } = req.body;
    const { id } = req.params;

    if (!shopifyCred || !shopifyCred.ShopName || !shopifyCred.accessToken) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid Shopify credentials." });
    }

    const shopifyAll = new ShopifyCRUD(
      shopifyCred.ShopName,
      shopifyCred.accessToken
    );

    const updatedProduct = await shopifyAll.updateProduct(
      parseInt(id),
      productDetails
    );
    res.send({ success: true, product: updatedProduct });
  } catch (error) {
    handleError(res, error);
  }
});

// Delete a product by ID
shopify.delete("/delete/:id", async (req, res) => {
  try {
    const { shopifyCred } = req.body;
    const { id } = req.params;

    if (!shopifyCred || !shopifyCred.ShopName || !shopifyCred.accessToken) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid Shopify credentials." });
    }

    const shopifyAll = new ShopifyCRUD(
      shopifyCred.ShopName,
      shopifyCred.accessToken
    );

    await shopifyAll.deleteProduct(parseInt(id));
    res.send({
      success: true,
      message: `Product with ID ${id} deleted successfully`,
    });
  } catch (error) {
    handleError(res, error);
  }
});

// Read a single product by ID
shopify.get("/read/:id", async (req, res) => {
  try {
    const { shopifyCred } = req.body;
    const { id } = req.params;

    if (!shopifyCred || !shopifyCred.ShopName || !shopifyCred.accessToken) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid Shopify credentials." });
    }

    const shopifyAll = new ShopifyCRUD(
      shopifyCred.ShopName,
      shopifyCred.accessToken
    );

    const product = await shopifyAll.getProduct(parseInt(id));
    res.send({ success: true, product });
  } catch (error) {
    handleError(res, error);
  }
});

// Read all products
shopify.get("/read-all", async (req, res) => {
  try {
    const { shopifyCred } = req.body;

    if (!shopifyCred || !shopifyCred.ShopName || !shopifyCred.accessToken) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid Shopify credentials." });
    }

    const shopifyAll = new ShopifyCRUD(
      shopifyCred.ShopName,
      shopifyCred.accessToken
    );

    const products = await shopifyAll.listProducts();
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
