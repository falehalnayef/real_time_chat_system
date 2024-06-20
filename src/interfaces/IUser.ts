import { Document, Model, ObjectId } from "mongoose";

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

export interface IUserDocument extends IUser, Document {}

export interface IUserModel extends Model<IUserDocument> {}
