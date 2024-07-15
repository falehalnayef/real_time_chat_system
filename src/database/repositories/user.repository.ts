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
    password: string
  ): Promise<void> {
    await this.userModel.model.create({ userName, email, password });
  }

  async getUserByEmail(
    email: string
  ): Promise<IUser | null> {
    return await this.userModel.model.findOne({$where:
      email
    }).select("_id name password");
  }
}
