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
    photoPath: string
  ): Promise<void> {
    await this.userModel.model.create({ userName, email, password , bio, photoPath});
  }

  async getUserByEmail(
    email: string
  ): Promise<IUser | null> {
    return await this.userModel.model.findOne({
      email
    }).select("_id name password");
  }

  async getUserById(
    _id: ObjectId
  ): Promise<IUser | null> {
    return await this.userModel.model.findOne({
      _id
    });
  }

  async updateUser(
    record: IUser
  ): Promise<void> {
     await this.userModel.model.updateOne({
record

});
  }
}
