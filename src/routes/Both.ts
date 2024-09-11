import express from "express";
import { isVerifiedUser } from "../middleware";
import { PrismaClient } from "@prisma/client";
import ShopifyCRUD from "../Class/shopify";
import WooCommerceCRUD from "../Class/woocommerce";
import { woocommerce } from "./woocommerce";
const prisma = new PrismaClient();

export const both = express.Router();

both.use(isVerifiedUser);

interface UpdateProductDetails {
  id: number;
  WooCommerceId?: string;
  ShopifyId?: string;
  platform: Store[]; // Array of enum values, either "Shopify", "WooCommerce", etc.
  name: string; // Common field (name in WooCommerce, title in Shopify)
  description: string; // Common field (description in WooCommerce, bodyHtml in Shopify)
  shortDescription?: string; // WooCommerce specific
  status: string; // Common field
  featured?: boolean; // WooCommerce specific
  sku?: string; // Common field
  price: string; // Common field
  regularPrice?: string; // Common field
  salePrice?: string; // Common field
  onSale: boolean; // Common field
  purchasable?: boolean; // WooCommerce specific
  manageStock: boolean; // Common field
  stockQuantity?: string; // Common field
  userId: string; // ID of the user associated with this product
}

interface ProductDetails {
  WooCommerceId?: string;
  ShopifyId?: string;
  platform: Store[]; // Array of enum values, either "Shopify", "WooCommerce", etc.
  name: string; // Common field (name in WooCommerce, title in Shopify)
  description: string; // Common field (description in WooCommerce, bodyHtml in Shopify)
  shortDescription?: string; // WooCommerce specific
  status: string; // Common field
  featured?: boolean; // WooCommerce specific
  sku?: string; // Common field
  price: number; // Common field
  regularPrice?: number; // Common field
  salePrice?: number; // Common field
  onSale: boolean; // Common field
  purchasable?: boolean; // WooCommerce specific
  manageStock: boolean; // Common field
  stockQuantity?: number; // Common field
  userId: string;
  image: string;
  imageUrls: string[]; // ID of the user associated with this product
}

// Enum for Store
enum Store {
  Shopify = "Shopify",
  WooCommerce = "WooCommerce",
  Others = "Others",
  Nothing = "Nothing",
}

both.post("/createProduct", async (req, res) => {
  const { productDetails, userId } = req.body;
  console.log("request from Server", productDetails);

  productDetails.userId = userId;
  if (!productDetails) {
    return res.send({
      process: false,
      message: "In Request Products Not Found",
    });
  }

  try {
    const isProduct = await CreateProduct(productDetails);
    if (!isProduct) {
      return res.send({
        process: false,
        message: "Product creation failed",
      });
    }

    const getCredentials = await prisma.shopCred.findUnique({
      where: {
        userId: isProduct.userId,
      },
    });

    if (!getCredentials) {
      return res.send({
        process: false,
        message: "Credentials not found. Please update them.",
      });
    }

    let shopifyCreated = false;
    let woocommerceCreated = false;
    let images: any[] = [];
    let woocommerceimage = [{ src: isProduct.image }];
    isProduct.images.map((url) => {
      const image = {
        src: url,
      };
      images.push(image);
      woocommerceimage.push(image);
    });

    if (getCredentials?.connectedWith.includes("Shopify")) {
      console.log("Entered Shopify");

      const shopifyRequest = {
        title: isProduct.name,
        body_html: isProduct.description,
        status: "active",
        variants: [
          {
            title: isProduct.name,
            price: isProduct.price,
            position: 1,
            sku: isProduct.sku,
            inventory_quantity: Number(isProduct.stockQuantity),
          },
        ],
        image: isProduct.image || "https://avatar.vercel.sh/rauchg",
        images: images,
      };

      if (
        getCredentials?.shopifyShopName &&
        getCredentials.shopifyAccessToken
      ) {
        const shopifyProduct = new ShopifyCRUD(
          getCredentials?.shopifyShopName,
          getCredentials?.shopifyAccessToken
        );
        const response = await shopifyProduct.createProduct(shopifyRequest);
        if (response) {
          console.log(response);
          const ShopifyProductId = response.id;

          const updateProductId = await prisma.product.update({
            where: {
              id: isProduct.id,
            },
            data: {
              ShopifyId: ShopifyProductId.toString(),
            },
          });
          if (response && updateProductId) {
            shopifyCreated = true;
            console.log("Created on Shopify");
          }
        }
      }
    }

    if (getCredentials?.connectedWith.includes("WooCommerce")) {
      console.log("Entered WooCommerce");
      const wooCommerceRequest = {
        name: isProduct.name,

        description: isProduct.description,
        short_description: isProduct.shortDescription,
        stock_quantity: Number(isProduct.stockQuantity),
        sku: isProduct.sku,
        price: isProduct.price,
        images: woocommerceimage,
      };
      if (
        getCredentials?.wooCommerceConsumerKey &&
        getCredentials.wooCommerceConsumerSecret &&
        getCredentials.wooCommerceUrl
      ) {
        const WooCommerceProduct = new WooCommerceCRUD(
          getCredentials.wooCommerceUrl,
          getCredentials?.wooCommerceConsumerKey,
          getCredentials.wooCommerceConsumerSecret
        );
        const response = await WooCommerceProduct.createProduct(
          wooCommerceRequest
        );

        if (response) {
          const { id } = response;
          const updateProductId = await prisma.product.update({
            where: {
              id: isProduct.id,
            },
            data: {
              WooCommerceId: id.toString(),
            },
          });
          if (response && updateProductId) {
            woocommerceCreated = true;

            console.log("Created on WooCommerce", response);
          }
        }
      }
    }

    if (shopifyCreated || woocommerceCreated) {
      return res.send({
        process: true,
        message: "Product updated successfully on connected platforms.",
      });
    } else {
      return res.send({
        process: false,
        message: "Product creation on external platforms failed.",
      });
    }
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).send({
      process: false,
      message: "An error occurred while creating the product.",
    });
  }
});

both.put("/updateProduct", async (req, res) => {
  const { productDetails, userId } = req.body;
  console.log("received request", productDetails);

  productDetails.userId = userId;
  if (!productDetails) {
    return res.send({
      process: false,
      message: "In Request Products Not Found",
    });
  }

  const isProduct = await updateProduct(productDetails, userId);

  const getCredentials = await prisma.shopCred.findUnique({
    where: {
      userId: isProduct.userId,
    },
  });

  if (!getCredentials) {
    return res.send({
      process: false,
      message: "Credentials not found. Please update them.",
    });
  }

  let shopifyUpdated = false;
  let woocommerceUpdated = false;

  if (getCredentials?.connectedWith.includes("Shopify")) {
    console.log("Entered Shopify");
    const shopifyRequest = {
      title: isProduct.name,
      body_html: isProduct.description,
      status: "active",
      variants: [
        {
          title: isProduct.name,
          price: isProduct.price,
          position: 1,
          sku: isProduct.sku,
          inventory_quantity: Number(isProduct.stockQuantity),
        },
      ],
      image: isProduct.image || "https://avatar.vercel.sh/rauchg",
    };

    if (
      getCredentials?.shopifyShopName &&
      getCredentials.shopifyAccessToken &&
      isProduct.ShopifyId
    ) {
      const shopifyProduct = new ShopifyCRUD(
        getCredentials?.shopifyShopName,
        getCredentials?.shopifyAccessToken
      );
      const response = await shopifyProduct.updateProduct(
        Number(isProduct.ShopifyId),
        shopifyRequest
      );
      if (response) {
        shopifyUpdated = true;
        console.log("Created on Shopify");
      }
    }
  }

  if (getCredentials?.connectedWith.includes("WooCommerce")) {
    console.log("Entered WooCommerce");
    const wooCommerceRequest = {
      name: isProduct.name,

      description: isProduct.description,
      short_description: isProduct.shortDescription,
      stock_quantity: Number(isProduct.stockQuantity),
      sku: isProduct.name.slice(2) + isProduct.id,
      price: isProduct.price,
      images: [
        {
          src: isProduct.image || "https://avatar.vercel.sh/rauchg.png",
        },
      ],
    };
    if (
      getCredentials?.wooCommerceConsumerKey &&
      getCredentials.wooCommerceConsumerSecret &&
      getCredentials.wooCommerceUrl
    ) {
      const WooCommerceProduct = new WooCommerceCRUD(
        getCredentials.wooCommerceUrl,
        getCredentials?.wooCommerceConsumerKey,
        getCredentials.wooCommerceConsumerSecret
      );
      const response = await WooCommerceProduct.updateProduct(
        Number(isProduct.WooCommerceId),
        wooCommerceRequest
      );

      if (response) {
        woocommerceUpdated = true;
        console.log("Updated on WooCommerce");
      }
    }
  }

  if (shopifyUpdated || woocommerceUpdated) {
    return res.send({
      process: true,
      message: "Product updated successfully on connected platforms.",
    });
  } else {
    return res.send({
      process: false,
      message: "Product Updation on external platforms failed.",
    });
  }
});

both.delete("/deleteProduct", async (req, res) => {
  const { productId, userId } = req.body;

  if (!productId) {
    return res.status(400).send({
      process: false,
      message: "Product ID is required.",
    });
  }

  try {
    // Assume DeleteProduct is a function that deletes the product from your database
    const isDeleted = await DeleteProduct(productId);

    if (!isDeleted) {
      return res.status(404).send({
        process: false,
        message: "Product not found or already deleted.",
      });
    }

    const getCredentials = await prisma.shopCred.findUnique({
      where: {
        userId: isDeleted.userId,
      },
    });

    if (!getCredentials) {
      return res.status(404).send({
        process: false,
        message: "Credentials not found. Please update them.",
      });
    }

    let DeletedAtShopify = false;
    let DeletedAtWoocommerce = false;

    if (getCredentials?.connectedWith.includes("Shopify")) {
      if (
        getCredentials?.shopifyShopName &&
        getCredentials.shopifyAccessToken &&
        isDeleted.ShopifyId
      ) {
        const shopifyProduct = new ShopifyCRUD(
          getCredentials?.shopifyShopName,
          getCredentials?.shopifyAccessToken
        );

        try {
          await shopifyProduct.deleteProduct(Number(isDeleted.ShopifyId));
          DeletedAtShopify = true;
          console.log("Deleted from Shopify");
        } catch (error) {
          console.error("Error deleting from Shopify:", error);
          // Optionally, you might want to send a partial success response or log the error for further action.
        }
      }
    }

    if (getCredentials.connectedWith.includes("WooCommerce")) {
      if (
        getCredentials?.wooCommerceConsumerKey &&
        getCredentials.wooCommerceConsumerSecret &&
        getCredentials.wooCommerceUrl &&
        isDeleted.WooCommerceId
      ) {
        const WooCommerceProduct = new WooCommerceCRUD(
          getCredentials.wooCommerceUrl,
          getCredentials?.wooCommerceConsumerKey,
          getCredentials.wooCommerceConsumerSecret
        );

        try {
          await WooCommerceProduct.deleteProduct(
            Number(isDeleted.WooCommerceId)
          );
          DeletedAtWoocommerce = true;
          console.log("Deleted from WooCommerce");
        } catch (error) {
          console.error("Error deleting from WooCommerce:", error);
          // Optionally, you might want to send a partial success response or log the error for further action.
        }
      }
    }

    // Final response based on deletion results
    if (DeletedAtShopify || DeletedAtWoocommerce) {
      return res.send({
        process: true,
        message: "Product deleted successfully from connected platforms.",
        ShopifyDeleted: DeletedAtShopify,
        WooCommerceDeleted: DeletedAtWoocommerce,
      });
    } else {
      return res.status(500).send({
        process: false,
        message: "Product deletion failed on external platforms.",
      });
    }
  } catch (error) {
    console.error("Error during product deletion:", error);
    return res.status(500).send({
      process: false,
      message: "An error occurred while deleting the product.",
    });
  }
});

export async function updateProduct(
  productDetails: UpdateProductDetails,
  userId: string
) {
  try {
    const isProduct = await prisma.product.update({
      where: {
        userId: userId,
        id: Number(productDetails.id),
      },
      data: {
        ...productDetails,
      },
    });
    return isProduct;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}
export async function CreateProduct(productDetails: ProductDetails) {
  try {
    const isProduct = await prisma.product.create({
      data: {
        WooCommerceId: productDetails.WooCommerceId || null,
        ShopifyId: productDetails.ShopifyId || null,
        platform: productDetails.platform || ["Nothing"], // Assuming platform is an array of enum values
        name: productDetails.name,
        description: productDetails.description,
        shortDescription: productDetails.shortDescription || null,
        status: productDetails.status,
        featured: productDetails.featured || false,
        sku: productDetails.sku || null,
        price: productDetails.price.toString(),
        regularPrice: productDetails.regularPrice
          ? productDetails.regularPrice.toString()
          : "",
        salePrice: productDetails.salePrice
          ? productDetails.salePrice.toString()
          : "",
        onSale: productDetails.onSale,
        purchasable: productDetails.purchasable || false,
        manageStock: productDetails.manageStock,
        stockQuantity: productDetails.stockQuantity
          ? productDetails.stockQuantity.toString()
          : "",
        userId: productDetails.userId,
        image: productDetails.image,
        images: productDetails.imageUrls,
        // Ensure this is provided and valid
      },
    });

    return isProduct;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

export async function DeleteProduct(id: number) {
  try {
    const isDeleted = await prisma.product.delete({
      where: {
        id: id,
      },
    });

    return isDeleted;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}
