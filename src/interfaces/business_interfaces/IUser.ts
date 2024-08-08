import {ObjectId } from "mongoose";

export interface IUser {
  _id: ObjectId;
  userName: string;
  email: string;
  password: string;
  isActive: boolean;
  pohtoPath: string;
  bio: string;
  contacts: ObjectId[];
  blockedUsers: ObjectId[];
  groups: ObjectId[];
  otp: string | undefined;
  otpExpiresIn: Date | undefined;
  resetPasswordToken: string | undefined;
}

export interface IUserRepository{

  addUser(userName: string, email: string, password: string, bio: string, photoPath: string, otp: string, otpExpiresIn: Date): Promise<void>;

  getUserByEmail(email: string): Promise<IUser | null>;

  getUserById(_id: ObjectId): Promise<IUser | null>;

  getUserProfileById(_id: ObjectId): Promise<IUser | null>;

  getUserByOTP(otp: string): Promise<IUser | null>;

  updateUser(record: IUser): Promise<void>;
}


