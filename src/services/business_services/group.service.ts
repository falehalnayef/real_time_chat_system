
import dotenv from "dotenv";
import { IGroupRepository } from "../../interfaces/business_interfaces/IGroup";
import { FileInfo } from "../../types/fileInfo.type";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils_services/cloudinary.service";
import { IUser, IUserRepository } from "../../interfaces/business_interfaces/IUser";
import StatusError from "../../utils/statusError";
import { ObjectId } from "mongoose";

dotenv.config();

export class GroupService{
    private cloudinaryImageFolder: string = process.env.CLOUDINARY_GROUP_IMAGES_FOLDER!;
    
private grouoRepository: IGroupRepository;
private userRepository: IUserRepository;

constructor(grouoRepository: IGroupRepository, userRepository: IUserRepository){
    this.grouoRepository = grouoRepository;
    this.userRepository = userRepository;
}
     async createGroup(user: IUser, groupName: string, bio: string, image: FileInfo) {

        const url = uploadToCloudinary(image.data!, "image", String(this.cloudinaryImageFolder));

       const group = await this.grouoRepository.addGroup(groupName, bio, await url, user._id);

       group.members.push(user._id);
       group.membersCount += 1;
       user.groups.push(group._id);

       await this.userRepository.updateUser(user);
       await this.grouoRepository.updateGroup(group);

      }
     
      async removeGroup(user: IUser, groupId: string) {

        if(!groupId) throw new StatusError(404, "groupId is required.");

        const group = await this.grouoRepository.getGroupInfoById(groupId);
        if(!group) throw new StatusError(404, "Group not found.");

        if(user._id != group.createdBy) throw new StatusError(403, "unauthorized.");

        const public_id = group.photoPath.match(new RegExp(`${this.cloudinaryImageFolder}/(.*?)(?=\\.[^.]*$)`))?.[0]!;

        await deleteFromCloudinary(public_id);
        await this.grouoRepository.deleteGroup(groupId);

      }

      // TODO: need to be implemented.
    //   async getGrpups(user: IUser, type: string | undefined){

    //     const groups = await this.grouoRepository.getGroups({});
    //   }

    async addUserToGroup(user: IUser, groupId: string, userId: ObjectId){

        if(!groupId || !userId) throw new StatusError(400, "groupId and userId are required.");

        const group = await this.grouoRepository.getGroupInfoById(groupId);
        if(!group) throw new StatusError(404, "Group not found."); 
    
        if(user._id != group.createdBy) throw new StatusError(403, "unauthorized.");

        const userToAdd = await this.userRepository.getUserById(userId);
        if(!userToAdd) throw new StatusError(404,"User not found.");
    
        group.members.push(userToAdd._id);
        group.membersCount += 1;
        userToAdd.groups.push(group._id);

        await this.grouoRepository.updateGroup(group);
        await this.userRepository.updateUser(userToAdd);

    }

    async removeUserFromGroup(user: IUser, groupId: string, userId: ObjectId){

        if(!groupId || !userId) throw new StatusError(400, "groupId and userId are required.");

        const group = await this.grouoRepository.getGroupInfoById(groupId);
        if(!group) throw new StatusError(404, "Group not found."); 
    
        if(user._id != group.createdBy) throw new StatusError(403, "unauthorized.");

        const userToRemove = await this.userRepository.getUserById(userId);
        if(!userToRemove) throw new StatusError(404,"User not found.");
    

        group.members = group.members.filter((id) => id !== userId);
        group.membersCount -= 1;
        userToRemove.groups = userToRemove.groups.filter((id) => id !== group._id);

        await this.grouoRepository.updateGroup(group);
        await this.userRepository.updateUser(userToRemove);

    }
} 