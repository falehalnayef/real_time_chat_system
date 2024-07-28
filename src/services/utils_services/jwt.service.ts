import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ObjectId } from "mongoose";
import { jwtPayload } from "../../types/jwtPayload.type";
dotenv.config();

export function generateAccessToken(_id: ObjectId) {
  return jwt.sign({ _id }, process.env.SECRET_ACCESS_KEY!, { expiresIn: process.env.EXPIRESINACESS! });
}


export function verifyToken(token: string): jwtPayload {
  return jwt.verify(token, process.env.SECRET_ACCESS_TOKEN!) as jwtPayload;
}

export function generateRefreshToken(_id: ObjectId) {
  return jwt.sign({ _id }, process.env.SECRET_REFRESH_KEY!, { expiresIn: process.env.EXPIRESINREFRESH! });
}


export function verifyRefreshToken(token: string): jwtPayload {
  return jwt.verify(token, process.env.SECRET_REFRESH_TOKEN!) as jwtPayload;
}


export function generateResetPasswordToken(_id: ObjectId) {
  return jwt.sign({ _id }, process.env.SECRET_RESETPASSWORD_KEY!, { expiresIn: process.env.EXPIRESINRESETPASSWORD! });
}

export function verifyResetPasswordToken(token: string): jwtPayload {
  return jwt.verify(token, process.env.SECRET_RESETPASSWORD_KEY!) as jwtPayload;
}
