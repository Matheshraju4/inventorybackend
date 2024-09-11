import { PrismaClient, Store } from "@prisma/client";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";
import { response } from "express";
// Define the type for the user data input
type UserData = {
  email: string;
  password: string;
  username: string;
  shopifyAccessToken: string;
  shopifyShopName: string;
  wooCommerceUrl: string;
  wooCommerceConsumerKey: string;
  wooCommerceConsumerSecret: string;
};

export async function Create(data: UserData) {
  const connectedWith: Store[] = [];

  if (data.shopifyAccessToken && data.shopifyShopName) {
    connectedWith.push(Store.Shopify);
  }

  if (
    data.wooCommerceUrl &&
    data.wooCommerceConsumerKey &&
    data.wooCommerceConsumerSecret
  ) {
    connectedWith.push(Store.WooCommerce);
  }

  if (connectedWith.length === 0) {
    connectedWith.push(Store.Nothing);
  }

  try {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        username: data.username,
        shopCred: {
          create: {
            shopifyAccessToken: data.shopifyAccessToken,
            shopifyShopName: data.shopifyShopName,
            wooCommerceUrl: data.wooCommerceUrl,
            wooCommerceConsumerKey: data.wooCommerceConsumerKey,
            wooCommerceConsumerSecret: data.wooCommerceConsumerSecret,
            connectedWith: connectedWith,
          },
        },
      },
    });
    console.log("User created:", user);
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

interface CreateUser {
  email: string;
  username: string;
  password: string;
}
export async function createUser({ email, password, username }: CreateUser) {
  const hashedPassword = await hashPassword(password);

  if (hashedPassword) {
    const response = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
      },
    });

    return { process: true, response };
  } else {
    return { process: false, response: "" };
  }
}

async function hashPassword(password: string) {
  const saltRounds = 10; // Number of salt rounds (you can adjust this)
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
  }
}
interface LoginUser {
  email: string;
  password: string;
}
export async function LoginUser({ email, password }: LoginUser) {
  const User = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (User) {
    const isSame = await verifyPassword(password, User?.password);
    if (isSame) {
      const accessToken = createToken(User.email);

      const UpdateaccessToken = await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          accessToken: accessToken,
        },
      });
      if (UpdateaccessToken) {
        return {
          process: true,
          accessToken: UpdateaccessToken.accessToken,
          message: "User found",
        };
      }
    } else {
      return {
        process: false,
        message: "Enter Correct Password",
      };
    }
  } else {
    return {
      process: false,
      message: "User Not found",
    };
  }
}
// Function to compare the password
async function verifyPassword(
  plainTextPassword: string,
  hashedPassword: string
) {
  try {
    const match = await bcrypt.compare(plainTextPassword, hashedPassword);
    return match;
  } catch (error) {
    console.error("Error verifying password:", error);
  }
}

function createToken(payload: string) {
  const token = jwt.sign(payload, process.env.secretKey!);
  return token;
}
