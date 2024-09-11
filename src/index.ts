import express, { Request, NextFunction, Response } from "express";
import cors from "cors";
import { shopify } from "./routes/shopify";
import { woocommerce } from "./routes/woocommerce";
import { createUser, LoginUser } from "./prisma";
import { PrismaClient } from "@prisma/client";
import { both } from "./routes/Both";
import { isVerifiedUser } from "./middleware";
import { fetch } from "./routes/fetch";

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

// Mount the users routes at /api/users
app.use("/shopify", shopify);
app.use("/woocommerce", woocommerce);
app.use("/both", both);
app.use("/fetch", fetch);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post("/createUser", async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const data = {
    username,
    email,
    password,
  };
  const User = await createUser(data);
  if (User.process === true) {
    res.send({
      message: "User created successfully",
    });
  } else {
    res.send({
      message: "Something went wrong while creating user",
    });
  }
});

app.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (email && password) {
    const data = { email, password };

    const isUser = await LoginUser(data);

    if (isUser?.process == true) {
      res.send(isUser);
    } else {
      res.send(isUser);
    }
  } else {
    res.send({
      process: false,
      message: "Request Didn't have Email or password",
    });
  }
});

// Middleware function to verify user and redirect if unauthorized

// Protected route
app.post(
  "/connectShops",
  isVerifiedUser,
  async (req: Request, res: Response) => {
    const { shopCred, userId } = req.body;

    const accessToken = req.headers["accesstoken"];

    if (shopCred && typeof accessToken === "string") {
      const updateCredentials = await prisma.shopCred.upsert({
        where: {
          userId: userId,
        },
        create: {
          ...shopCred,
          userId: userId,
        },
        update: {
          ...shopCred,
        },
      });

      if (updateCredentials) {
        res.send({ message: "Credentials  Updated Successfully" });
      }
    } else {
      res.send({ message: "Shop Credentials not found in the request" });
    }
  }
);

app.get("/getAllproducts", isVerifiedUser, async (req, res) => {
  const { userId } = req.body;
  const Allproducts = await prisma.product.findMany({
    where: {
      userId: userId,
    },
  });
  let Products: any = [];
  Allproducts.map((product) => {
    const {
      id,
      ShopifyId,
      WooCommerceId,
      image,
      name,
      price,
      shortDescription,
      description,
      sku,
      platform,
      stockQuantity,
    } = product;
    Products.push({
      id,
      ShopifyId,
      WooCommerceId,
      image,
      name,
      stockQuantity,
      price,
      shortDescription,
      description,
      sku,
      platform,
    });
  });
  res.send({ Products });
});
