import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ObjectId } from "mongoose";
import { jwtPayload } from "../../types/jwtPayload.type";
dotenv.config();

export function generateAccessToken(_id: ObjectId) {
  return jwt.sign({ _id }, process.env.SECRET_ACCESS_KEY!, { expiresIn: "1h" });
}


export function verifyToken(token: string): jwtPayload {
  return jwt.verify(token, process.env.SECRET_ACCESS_TOKEN!) as jwtPayload;
}

export function generateResetPasswordToken(_id: ObjectId) {
  return jwt.sign({ _id }, process.env.SECRET_RESETPASSWORD_KEY!, { expiresIn: "1h" });
}

export function verifyResetPasswordToken(token: string): jwtPayload {
  return jwt.verify(token, process.env.SECRET_RESETPASSWORD_KEY!) as jwtPayload;
}
