import mongoose, { Model, Schema, Document } from "mongoose";

export class GroupModel {
  private static _model: Model<Document>;

  constructor() {
    const schema = new Schema({
      groupName: { type: String, required: true },
      isPrivate: { type: Boolean, required: true, default: true },
      bio: { type: String, required: true },
      photoPath: { type: String, required: true }, 
      date: { type: Date, required: true, default: new Date() },
      createdBy: { type: Schema.Types.ObjectId, ref: "User" }, 
      members: [{ type: Schema.Types.ObjectId, ref: "User" }], 
      membersCount: {type: Number, required: true, default: 0}
    });
    schema.index({ groupName: 1 });
    schema.index({ members: 1 });

    GroupModel._model = mongoose.model<Document>("Group", schema);

  }
  public get model(): Model<Document> {
    return GroupModel._model;
  }
}
