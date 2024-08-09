import { ObjectId } from "mongoose";

export interface IGroup {
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

  addGroup(groupName: string, bio: string, photoPath: string, createdBy: ObjectId, isPrivate: boolean): Promise<IGroup>;

  getGroupById(_id: string): Promise<IGroup | null>;

  getGroupInfoById(_id: string): Promise<IGroup | null>;

  updateGroup(record: IGroup): Promise<void>;

  deleteGroup( _id: string): Promise<void>;

  getGroups(where:object): Promise<IGroup[]>;

}
