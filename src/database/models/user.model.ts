import mongoose, { Schema } from "mongoose";
import { IUserDocument, IUserModel } from "../../interfaces/business_interfaces/IUser";

export class UserModel {
  private _model: IUserModel;

  constructor() {
    const schema = new Schema({
      userName: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      bio: { type: String, required: true },
      photoPath: { type: String, required: true }, 
      blockedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
      contacts: [{ type: Schema.Types.ObjectId, ref: "User" }], 
      groups: [{ type: Schema.Types.ObjectId, ref: "Group" }], 
    });
    schema.index({ userName: 1 });
    schema.index({ groups: 1 });
    this._model = mongoose.model<IUserDocument>("User", schema); 
  }

  public get model(): IUserModel {
    return this._model;
  }
}
