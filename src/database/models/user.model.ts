import mongoose, { Model, Schema, Document } from "mongoose";

export class UserModel {
  private static _model: Model<Document>;

  constructor() {
    if (!UserModel._model) {
      const schema = new Schema({
        userName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isActive: { type: Boolean, default: false},
        bio: { type: String },
        photoPath: { type: String },
        blockedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
        contacts: [{ type: Schema.Types.ObjectId, ref: "User" }],
        groups: [{ type: Schema.Types.ObjectId, ref: "Group" }],
        otp: { type: String, unique: true},
        otpExpiresIn: { type: Date }, 
      });

      schema.index({ userName: 1 });
      schema.index({ groups: 1 });

      UserModel._model = mongoose.model<Document>("User", schema);
    }
  }

  public get model(): Model<Document> {
    return UserModel._model;
  }
}