import mongoose, { Model, Schema } from "mongoose";
import { IGroup } from "../../interfaces/business_interfaces/IGroup";

export class GroupModel {
  private static _model: Model<IGroup>;

  constructor() {
    const schema = new Schema({
      groupName: { type: String, required: true },
      isPrivate: { type: Boolean, required: true, default: true },
      bio: { type: String, default: null },
      photoPath: { type: String, default: null }, 
      date: { type: Date, required: true, default: new Date() },
      createdBy: { type: Schema.Types.ObjectId, ref: "User" }, 
      members: [{ type: Schema.Types.ObjectId, ref: "User" }], 
      membersCount: {type: Number, required: true, default: 0}
    });
    schema.index({ groupName: 1 });
    schema.index({ members: 1 });

    GroupModel._model = mongoose.model<IGroup>("Group", schema);

  }
  public get model(): Model<IGroup> {
    return GroupModel._model;
  }
}
