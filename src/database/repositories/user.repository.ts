import { ObjectId } from "mongoose";
import { IUser, IUserRepository } from "../../interfaces/business_interfaces/IUser";
import { UserModel } from "../models/user.model";

export class UserRepository implements IUserRepository {

    private userModel: UserModel;
    constructor(){
        this.userModel = new UserModel();
    }

  async addUser(
    userName: string,
    email: string,
    password: string,
    bio: string,
    photoPath: string,
    otp: string,
    otpExpiresIn: Date
  ): Promise<void> {
    await this.userModel.model.create({ userName, email, password , bio, photoPath, otp, otpExpiresIn});
  }

  async getUserByEmail(
    email: string
  ): Promise<IUser | null> {
    return await this.userModel.model.findOne({
      email
    }).select("_id name password isActive");
  }

  async getUserById(
    _id: ObjectId
  ): Promise<IUser | null> {
    return await this.userModel.model.findOne({
      _id
    }).select("_id isActive");
  }


  async getUserProfileById(
    _id: ObjectId
  ): Promise<IUser | null> {
    return await this.userModel.model.findOne({
      _id
    }).select("_id name email pohtoPath bio groups contacts blockedUsers");
  }
  
  async getUserByOTP(
    otp: string
  ): Promise<IUser | null> {
    return await this.userModel.model.findOne({
      otp
    }).select("_id otp otpExpiresIn isActive");
  }


  async updateUser(
    record: IUser
  ): Promise<void> {
     await this.userModel.model.updateOne({
record

});
  }
}
