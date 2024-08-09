
import dotenv from "dotenv";
import { IGroupRepository } from "../../interfaces/business_interfaces/IGroup";
import { FileInfo } from "../../types/fileInfo.type";
import { uploadToCloudinary } from "../utils_services/cloudinary.service";
import { IUser } from "../../interfaces/business_interfaces/IUser";

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
     
} 