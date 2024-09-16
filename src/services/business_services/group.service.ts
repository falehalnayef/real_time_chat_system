
import dotenv from "dotenv";
import { IGroupRepository } from "../../interfaces/business_interfaces/IGroup";
import { FileInfo } from "../../types/fileInfo.type";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils_services/cloudinary.service";
import { IUser, IUserRepository } from "../../interfaces/business_interfaces/IUser";
import StatusError from "../../utils/statusError";
import { ObjectId } from "mongoose";
import { GroupTypes } from "../../enums/groupTypes.enum";

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


        let url: string | undefined;
        if(image){
           url = await uploadToCloudinary(image.data!, "image", String(this.cloudinaryImageFolder));
        }

       const group = await this.groupRepository.addGroup(groupName, user._id, isPrivate, bio, url);


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

        if(String(group.createdBy) != String(user._id)) throw new StatusError(403, "unauthorized");

        const public_id = group.photoPath.match(new RegExp(`${this.cloudinaryImageFolder}/(.*?)(?=\\.[^.]*$)`))?.[0]!;

        await deleteFromCloudinary(public_id);
        await this.groupRepository.deleteGroup(groupId);

      }

    
    async getGroups(user: IUser, type?: any) {
      
  
      let deletionFlag = false;
        const { _id } = user;
        let query: Record<string, any> = {};
    
        switch (type) {
            case GroupTypes.Public:
                query = { isPrivate: false};
                break;  
            case GroupTypes.Membership:
                query = { 
                    _id: { $in: user.groups }
                };
                break;
            case GroupTypes.Ownership:
                query = { createdBy: _id };
                break;
            default:
                deletionFlag = true;
                query = { _id: { $in: user.groups } };
                break;
        } 
    
        const groups = await this.groupRepository.getGroups(query);

      
        if (deletionFlag && groups.length !== user.groups.length) {
          const existingGroupIds = groups.map(group => group._id.toString());

          const extraGroupIds = user.groups.filter(groupId => !existingGroupIds.includes(groupId.toString()));

          if (extraGroupIds.length > 0) {
              user.groups = user.groups.filter(groupId => !extraGroupIds.includes(groupId));

              await this.userRepository.updateUser(user);
          }
      }

      return groups;
    }
    

    async addUserToGroup(user: IUser, groupId: string, userId: ObjectId){

        if(!groupId || !userId) throw new StatusError(400, "groupId and userId are required.");

        const group = await this.groupRepository.getGroupInfoById(groupId);
        if(!group) throw new StatusError(404, "Group not found."); 
    
        if(String(group.createdBy) != String(user._id)) throw new StatusError(403, "unauthorized");

        const userToAdd = await this.userRepository.getUserProfileById(userId);
        if(!userToAdd) throw new StatusError(404,"User not found.");
    
        const exis = group.members.filter((id) => String(id) == String(userId));
        if(exis.length != 0) throw new StatusError(400, "User is already in the group");

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
    
        if(String(group.createdBy) != String(user._id)) throw new StatusError(403, "unauthorized");

        const userToRemove = await this.userRepository.getUserProfileById(userId);
        if(!userToRemove) throw new StatusError(404,"User not found.");
    

        group.members = group.members.filter((id) => String(id) !== String(userId));
        group.membersCount -= 1;
        userToRemove.groups = userToRemove.groups.filter((id) => String(id) !== String(group._id));

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

        const exis = group.members.filter((id) => String(id) == String(user._id));
        if(exis.length != 0) throw new StatusError(400, "User is already in the group");


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

        group.members = group.members.filter((id) => String(id) !== String(user._id));
      
        const l2 = group.members.length;

        if(l1 == l2) throw new StatusError(400, "User is not in the group."); 

        group.membersCount -= 1;

        const userToRemove = await this.userRepository.getUserProfileById(user._id);
        if(!userToRemove) throw new StatusError(404,"User not found.");

        userToRemove.groups = userToRemove.groups.filter((id) => String(id) !== String(group._id));

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


        if(String(group.createdBy) != String(user._id)) throw new StatusError(403, "unauthorized");

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

    async searchForPublicGroups(groupName: string){

      if(!groupName) throw new StatusError(400, "groupName is required.");

      const groups = await this.groupRepository.getGroups({isPrivate: false, groupName: {$regex: groupName, $options: "i"}});

      return groups;
    }
} 

