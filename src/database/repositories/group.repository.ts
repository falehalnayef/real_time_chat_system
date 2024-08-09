import { ObjectId } from "mongoose";
import { IGroup, IGroupRepository } from "../../interfaces/business_interfaces/IGroup";
import { GroupModel } from "../models/group.model";

export class GroupRepository implements IGroupRepository {

    private groupModel: GroupModel;
    constructor(){
        this.groupModel = new GroupModel();
    }

 

  async addGroup(
    groupName: string,
    bio: string,
    photoPath: string,
    createdBy: ObjectId
  ): Promise<void> {
    await this.groupModel.model.create({ groupName, bio, photoPath, createdBy});
  }

  async getGroupById(
    _id: ObjectId
  ): Promise<any> {
    return await this.groupModel.model.findOne({
      _id
    }).select("_id groupName isPrivate");
  }

  async updateGroup(
    record: IGroup
  ): Promise<void> {
     await this.groupModel.model.updateOne({
record

});
  }
}
