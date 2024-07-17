import {ObjectId } from "mongoose";

export interface IUser {
  _id: ObjectId;
  userName: string;
  email: string;
  password: string;
  pohtoPath: string;
  bio: string;
  contacts: ObjectId[];
  blockedUsers: ObjectId[];
  groups: ObjectId[];
}

export interface IUserRepository{

  addUser(userName: string, email: string, password: string, bio: string, photoPath: string): Promise<void>;
}

