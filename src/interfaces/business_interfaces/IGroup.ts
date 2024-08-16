import { ObjectId, Document } from "mongoose";

export interface IGroup extends Document{
  _id: ObjectId;
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

  addGroup(groupName: string, createdBy: ObjectId, isPrivate: boolean, bio?: string, photoPath?: string): Promise<IGroup>;

  getGroupById(_id: string): Promise<IGroup | null>;

  getGroupInfoById(_id: string): Promise<IGroup | null>;

  updateGroup(record: IGroup): Promise<void>;

  deleteGroup( _id: string): Promise<void>;

  getGroups(where:object): Promise<IGroup[]>;

}
