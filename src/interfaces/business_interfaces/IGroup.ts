import { Document, Model, ObjectId } from "mongoose";

export interface IGroup {
  groupName: string;
  members: ObjectId[];
  membersCount: number
  photoPath: string;
  bio: string;
  date: Date;
  createdBy: ObjectId;
  isPrivate: boolean

}

export interface IGroupDocument extends IGroup, Document {}

export interface IGroupModel extends Model<IGroupDocument> {}
