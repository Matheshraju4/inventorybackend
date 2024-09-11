import express, { Request, NextFunction, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function isVerifiedUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const accessToken = req.headers["accesstoken"]; // Access the token correctly

  if (accessToken) {
    const isUser = await prisma.user.findUnique({
      where: {
        accessToken: accessToken as string, // Typecast to string if necessary
      },
    });

    if (isUser) {
      req.body.userId = isUser.id;
      return next();
      // Proceed to the next middleware or route handler
    } else {
      return res.redirect("/login"); // Redirect to login if the token is invalid
    }
  } else {
    return res.send({
      message: "Access Token not found",
    }); // Redirect to login if the token is missing
  }
}
