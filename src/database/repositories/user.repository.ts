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
    otp: string,
    otpExpiresIn: Date,
    bio?: string,
    photoPath?: string,
  ): Promise<void> {
    await this.userModel.model.create({ userName, email, password , bio, photoPath, otp, otpExpiresIn});
  }

  async getUserByEmail(
    email: string
  ): Promise<IUser | null> {
    return await this.userModel.model.findOne({
      email
    }).select("_id name password isActive otp otpExpiresIn");
  }

  async getUserById(
    _id: ObjectId
  ): Promise<IUser | null> {
    return await this.userModel.model.findOne({
      _id
    }).select("_id isActive password resetPasswordToken contacts blockedUsers groups");
  }


  async getUserProfileById( 
    _id: ObjectId
  ): Promise<IUser | null> {
    return await this.userModel.model.findOne({ 
      _id
    }).select("_id name email photoPath bio groups");
  }

  async getUserContactsById(
    _id: ObjectId
  ): Promise<IUser | null> {
    return await this.userModel.model.findOne({
      _id
    }).select("contacts");
  }

  async getUserBlockedUsersById(
    _id: ObjectId
  ): Promise<IUser | null> {
    return await this.userModel.model.findOne({
      _id
    }).select("blockedUsers");
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
    await this.userModel.model.updateOne(
      { _id: record._id },
      { $set: record }
    );
  }


  async getUsers(where: Object, skip?: number, limit?: number): Promise<IUser[]> {
    const query = this.userModel.model.find(where).select("_id userName email photoPath bio");
    
    if (typeof skip === 'number') {
      query.skip(skip);
    }
    
    if (typeof limit === 'number') {
      query.limit(limit);
    }
    
    return await query.exec();
  }

  async countUsers(where: Object): Promise<number> {
    return await this.userModel.model.countDocuments(where);
  }
}
