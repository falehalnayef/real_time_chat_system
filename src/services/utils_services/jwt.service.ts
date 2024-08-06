import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ObjectId } from "mongoose";
import { jwtPayload } from "../../types/jwtPayload.type";
dotenv.config();

export function generateToken(_id: ObjectId, secret: string, expirationTime: string) {
  return jwt.sign({ _id }, secret, { expiresIn: expirationTime });
}


export function verifyToken(token: string, secret: string): jwtPayload {
  return jwt.verify(token, secret) as jwtPayload;
}
