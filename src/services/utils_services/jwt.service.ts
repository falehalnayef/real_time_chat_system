import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ObjectId } from "mongoose";
dotenv.config();

export function generateAccessToken(_id: ObjectId) {
  return jwt.sign({ _id }, process.env.SECRET_ACCESS_KEY!, { expiresIn: "1h" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.SECRET_ACCESS_TOKEN!);
}
