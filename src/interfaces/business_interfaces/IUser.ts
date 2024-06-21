import {ObjectId } from "mongoose";

export interface IUser {
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

  addUser(userName: string, email: string, password: string): Promise<void>;
}

