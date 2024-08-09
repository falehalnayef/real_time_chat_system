import { ObjectId } from "mongoose";
import { IGroup, IGroupRepository } from "../../interfaces/business_interfaces/IGroup";
import { GroupModel } from "../models/group.model";

export class GroupRepository implements IGroupRepository {

    private groupModel: GroupModel;
    constructor(){
        this.groupModel = new GroupModel();
    }


 async getGroups(where:object): Promise<IGroup[]> {
    return await this.groupModel.model.find(where);
  }


 async deleteGroup( _id: string): Promise<void> {
    await this.groupModel.model.deleteOne({_id});
  }

 

  async addGroup(
    groupName: string,
    bio: string,
    photoPath: string,
    createdBy: ObjectId
  ): Promise<any> {
    return await this.groupModel.model.create({ groupName, bio, photoPath, createdBy});
  }

  async getGroupById(
    _id: string
  ): Promise<any> {
    return await this.groupModel.model.findOne({
      _id
    }).select("_id groupName isPrivate");
  }


  async getGroupInfoById(
    _id: string
  ): Promise<any> {
    return await this.groupModel.model.findOne({
      _id
    });
  }
  
  async updateGroup(
    record: IGroup
  ): Promise<void> {
     await this.groupModel.model.updateOne({
record

});
  }
}
