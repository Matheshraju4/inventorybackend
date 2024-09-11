import express from "express";
import { isVerifiedUser } from "../middleware";
import { PrismaClient } from "@prisma/client";
import ShopifyCRUD from "../Class/shopify";
const prisma = new PrismaClient();

export const fetch = express.Router();

fetch.use(isVerifiedUser);

fetch.post("/getDataFromShopify", async (req, res) => {
  const { userId } = req.body;

  try {
    const shopCred = await prisma.shopCred.findUnique({
      where: {
        userId,
      },
    });

    if (shopCred?.shopifyShopName && shopCred.shopifyAccessToken) {
      const AllProduct = new ShopifyCRUD(
        shopCred.shopifyShopName,
        shopCred.shopifyAccessToken
      );

      const Products = await AllProduct.listProducts();

      for (const product of Products) {
        const { id, title, body_html, sku, variants, image, status } = product;
        const { inventory_quantity, price } = variants[0];
        const src = image ? image.src : "";

        console.log("product", {
          id,
          title,
          body_html,
          sku,
          src,
          inventory_quantity,
          price,
          status,
        });

        await prisma.product.upsert({
          where: {
            ShopifyId: id.toString(),
          },
          create: {
            userId: userId.toString(),
            description: body_html?.toString() || "",
            name: title.toString(),
            image: src,
            stockQuantity: inventory_quantity.toString(),
            ShopifyId: id.toString(),
            price: price.toString(),
            status: status || "active", // Default status if not provided
            onSale: false, // Adjust this based on your needs
            manageStock: true,
            platform: ["Shopify"], // Adjust this based on your needs
          },
          update: {
            description: body_html?.toString() || "",
            name: title.toString(),
            image: src,
            stockQuantity: inventory_quantity.toString(),
            price: price.toString(),
            status: status || "active", // Default status if not provided
            onSale: false, // Adjust this based on your needs
            manageStock: true,
            platform: ["Shopify"], // Adjust this based on your needs
          },
        });
      }

      res.send({
        process: true,
        message: "Products fetched and stored successfully",
      });
    } else {
      res.send({
        process: false,
        message: "Shopify Credentials not found. Please update them.",
      });
    }
  } catch (error) {
    console.error("Error fetching or storing products:", error);
    res.status(500).send({
      process: false,
      message: "An error occurred while fetching or storing products.",
    });
  }
});
