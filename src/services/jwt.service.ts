import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function generateAccessToken(id: number) {
  return jwt.sign({ id }, process.env.SECRET_ACCESS_KEY!, { expiresIn: "1h" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.SECRET_ACCESS_TOKEN!);
}
