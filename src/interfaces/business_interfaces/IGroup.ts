import { ObjectId } from "mongoose";

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

export interface IGroupRepository{

  addGroup(groupName: string, bio: string, photoPath: string, createdBy: ObjectId): Promise<void>;

  getGroupById(_id: string): Promise<IGroup | null>;

  getGroupInfoById(_id: string): Promise<IGroup | null>;

  updateGroup(record: IGroup): Promise<void>;

  deleteGroup( _id: string): Promise<void>;

}
