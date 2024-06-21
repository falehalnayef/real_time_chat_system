import mongoose, { Schema } from "mongoose";
import { IGroupDocument, IGroupModel } from "../../interfaces/IGroup";

export class GroupModel {
  private _model: IGroupModel;

  constructor() {
    const schema = new Schema({
      groupName: { type: String, required: true },
      isPrivate: { type: Boolean, required: true, default: true },
      bio: { type: String, required: true },
      photoPath: { type: String, required: true }, 
      date: { type: Date, required: true },
      createdBy: { type: Schema.Types.ObjectId, ref: "User" }, 
      members: [{ type: Schema.Types.ObjectId, ref: "User" }], 
      membersCount: {type: Number, required: true}
    });
    schema.index({ groupName: 1 });
    schema.index({ members: 1 });


    this._model = mongoose.model<IGroupDocument>("Group", schema); 
  }

  public get model(): IGroupModel {
    return this._model;
  }
}
