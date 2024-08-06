import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ObjectId } from "mongoose";
import { jwtPayload } from "../../types/jwtPayload.type";
dotenv.config();

export function generateAccessToken(_id: ObjectId) {
  return jwt.sign({ _id }, process.env.JWT_ACCESS_SECRET!, { expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME! });
}


export function verifyToken(token: string): jwtPayload {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as jwtPayload;
}

export function generateRefreshToken(_id: ObjectId) {
  return jwt.sign({ _id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME! });
}


export function verifyRefreshToken(token: string): jwtPayload {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as jwtPayload;
}


export function generateResetPasswordToken(_id: ObjectId) {
  return jwt.sign({ _id }, process.env.JWT_RESETPASSWORD_SECRET!, { expiresIn: process.env.JWT_RESETPASSWORD_EXPIRATION_TIME! });
}

export function verifyResetPasswordToken(token: string): jwtPayload {
  return jwt.verify(token, process.env.JWT_RESETPASSWORD_SECRET!) as jwtPayload;
}
