
import dotenv from "dotenv";
import { IGroupRepository } from "../../interfaces/business_interfaces/IGroup";
import { FileInfo } from "../../types/fileInfo.type";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils_services/cloudinary.service";
import { IUser, IUserRepository } from "../../interfaces/business_interfaces/IUser";
import StatusError from "../../utils/statusError";
import { ObjectId } from "mongoose";
import { GroupTypes } from "../../enums/grpoupTypes.enum";

dotenv.config();

export class GroupService{
    private cloudinaryImageFolder: string = process.env.CLOUDINARY_GROUP_IMAGES_FOLDER!;
    
private groupRepository: IGroupRepository;
private userRepository: IUserRepository;

constructor(groupRepository: IGroupRepository, userRepository: IUserRepository){
    this.groupRepository = groupRepository;
    this.userRepository = userRepository;
}
     async createGroup(user: IUser, groupName: string, bio: string, isPrivate: boolean, image: FileInfo) {

        const url = uploadToCloudinary(image.data!, "image", String(this.cloudinaryImageFolder));

       const group = await this.groupRepository.addGroup(groupName, bio, await url, user._id, isPrivate);


       const userToAdd = await this.userRepository.getUserProfileById(user._id);
       if(!userToAdd) throw new StatusError(404,"User not found.");

       group.members.push(userToAdd._id);
       group.membersCount += 1;
       userToAdd.groups.push(group._id);

       await this.userRepository.updateUser(userToAdd);
       await this.groupRepository.updateGroup(group);

      }
     
      async removeGroup(user: IUser, groupId: string) {

        if(!groupId) throw new StatusError(404, "groupId is required.");

        const group = await this.groupRepository.getGroupInfoById(groupId);
        if(!group) throw new StatusError(404, "Group not found.");

        if(user._id != group.createdBy) throw new StatusError(403, "unauthorized.");

        const public_id = group.photoPath.match(new RegExp(`${this.cloudinaryImageFolder}/(.*?)(?=\\.[^.]*$)`))?.[0]!;

        await deleteFromCloudinary(public_id);
        await this.groupRepository.deleteGroup(groupId);

      }

    
    async getGroups(user: IUser, type?: any) {
      
  
        const { _id } = user;
        let query: Record<string, any> = {};
    
        switch (type) {
            case GroupTypes.Public:
                query = { isPrivate: false, members: { $ne: _id } };
                break;
            case GroupTypes.Membership:
                query = { 
                    members: { $elemMatch: { id: _id } }, 
                    createdBy: { $ne: _id } 
                };
                break;
            case GroupTypes.Ownership:
                query = { createdBy: _id };
                break;
            default:
                query = { members: { $elemMatch: { id: _id } } };
                break;
        }
    
        return await this.groupRepository.getGroups(query);
    }
    

    async addUserToGroup(user: IUser, groupId: string, userId: ObjectId){

        if(!groupId || !userId) throw new StatusError(400, "groupId and userId are required.");

        const group = await this.groupRepository.getGroupInfoById(groupId);
        if(!group) throw new StatusError(404, "Group not found."); 
    
        if(user._id != group.createdBy) throw new StatusError(403, "unauthorized.");

        const userToAdd = await this.userRepository.getUserProfileById(userId);
        if(!userToAdd) throw new StatusError(404,"User not found.");
    
        group.members.push(userToAdd._id);
        group.membersCount += 1;
        userToAdd.groups.push(group._id);

        await this.groupRepository.updateGroup(group);
        await this.userRepository.updateUser(userToAdd);

    }

    async removeUserFromGroup(user: IUser, groupId: string, userId: ObjectId){

        if(!groupId || !userId) throw new StatusError(400, "groupId and userId are required.");

        const group = await this.groupRepository.getGroupInfoById(groupId);
        if(!group) throw new StatusError(404, "Group not found."); 
    
        if(user._id != group.createdBy) throw new StatusError(403, "unauthorized.");

        const userToRemove = await this.userRepository.getUserProfileById(userId);
        if(!userToRemove) throw new StatusError(404,"User not found.");
    

        group.members = group.members.filter((id) => id !== userId);
        group.membersCount -= 1;
        userToRemove.groups = userToRemove.groups.filter((id) => id !== group._id);

        await this.groupRepository.updateGroup(group);
        await this.userRepository.updateUser(userToRemove);

    }


    async joinPublicGroup(user: IUser, groupId: string){

        if(!groupId) throw new StatusError(400, "groupId is required.");

        const group = await this.groupRepository.getGroupInfoById(groupId);
        if(!group) throw new StatusError(404, "Group not found."); 
    
        if(group.isPrivate) throw new StatusError(403, "This group is private.");
    


        const userToAdd = await this.userRepository.getUserProfileById(user._id);
        if(!userToAdd) throw new StatusError(404,"User not found.");


        group.members.push(userToAdd._id);
        group.membersCount += 1;
        userToAdd.groups.push(group._id);

        await this.groupRepository.updateGroup(group);
        await this.userRepository.updateUser(userToAdd);
    }   

    async leaveGroup(user: IUser, groupId: string){

        if(!groupId) throw new StatusError(400, "groupId is required.");

        const group = await this.groupRepository.getGroupInfoById(groupId);
        if(!group) throw new StatusError(404, "Group not found."); 
    
        const l1 = group.members.length;

        group.members = group.members.filter((id) => id !== user._id);

        const l2 = group.members.length;

        if(l1 == l2) throw new StatusError(400, "User is not in the group."); 

        group.membersCount -= 1;

        const userToRemove = await this.userRepository.getUserProfileById(user._id);
        if(!userToRemove) throw new StatusError(404,"User not found.");

        userToRemove.groups = userToRemove.groups.filter((id) => id !== group._id);

        await this.groupRepository.updateGroup(group);
        await this.userRepository.updateUser(userToRemove);

    }

    async getGroupInfo(user: IUser, groupId: string){

        if(!groupId) throw new StatusError(400, "groupId is required.");

        const userInfo = await this.userRepository.getUserProfileById(user._id);
        if(!userInfo) throw new StatusError(404,"User not found.");
 
        const group = await this.groupRepository.getGroupInfoById(groupId);
        if(!group) throw new StatusError(404, "Group not found.");

        const check = userInfo.groups.filter((id)=> id == group._id);

        if(!check) throw new StatusError(403, "You are not in the group");

        return group;
    }


    async editGroupInfo(user: IUser, groupId: string, updatedData: any){

        const {groupName, image, bio, isPrivate} = updatedData;

        const group = await this.groupRepository.getGroupInfoById(groupId);
        if(!group) throw new StatusError(404, "Group not found.");

        if(group.createdBy != user._id) throw new StatusError(403, "unauthorized");

        if(groupName){         
            group.groupName = groupName;
          }

          if(image){
        const url = await uploadToCloudinary(image.data!, "image", String(this.cloudinaryImageFolder));         

        const public_id = group.photoPath.match(new RegExp(`${this.cloudinaryImageFolder}/(.*?)(?=\\.[^.]*$)`))?.[0]!;

        await deleteFromCloudinary(public_id);

        group.photoPath = url;
        
          }
          if(bio){
         
            group.bio = bio;
          }

          if(isPrivate != undefined){
            group.isPrivate = isPrivate;
          }

    
          await this.groupRepository.updateGroup(group);

    }
} 

