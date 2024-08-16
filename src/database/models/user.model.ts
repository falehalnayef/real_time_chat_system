import mongoose, { Model, Schema } from "mongoose";
import { IUser } from "../../interfaces/business_interfaces/IUser";

export class UserModel {
  private static _model: Model<IUser>;

  constructor() {
    if (!UserModel._model) {
      const schema = new Schema({
        userName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isActive: { type: Boolean, default: false},
        bio: { type: String, default: null },
        photoPath: { type: String, default: null },
        blockedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
        contacts: [{ type: Schema.Types.ObjectId, ref: "User" }],
        groups: [{ type: Schema.Types.ObjectId, ref: "Group" }],
        otp: { type: String, unique: true},
        otpExpiresIn: { type: Date }, 
        resetPasswordToken: {type: String}
      });

      schema.index({ userName: 1 });
      schema.index({ groups: 1 });

      UserModel._model = mongoose.model<IUser>("User", schema);
    }
  }

  public get model(): Model<IUser> {
    return UserModel._model;
  }
}