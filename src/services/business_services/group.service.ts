
import dotenv from "dotenv";
import { IGroupRepository } from "../../interfaces/business_interfaces/IGroup";
import { FileInfo } from "../../types/fileInfo.type";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils_services/cloudinary.service";
import { IUser } from "../../interfaces/business_interfaces/IUser";
import StatusError from "../../utils/statusError";

dotenv.config();

export class GroupService{
    private cloudinaryImageFolder: string = process.env.CLOUDINARY_GROUP_IMAGES_FOLDER!;
    
private grouoRepository: IGroupRepository;

constructor(grouoRepository: IGroupRepository){
    this.grouoRepository = grouoRepository;
}
     async createGroup(user: IUser, groupName: string, bio: string, image: FileInfo) {

        const url = uploadToCloudinary(image.data!, "image", String(this.cloudinaryImageFolder));

        await this.grouoRepository.addGroup(groupName, bio, await url, user._id);

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
} 