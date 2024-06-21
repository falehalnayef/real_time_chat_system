import mongoose, { Model, Schema, Document } from "mongoose";

export class UserModel {
  private _model: Model<Document>;

  constructor() {
    const schema = new Schema({
      userName: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      bio: { type: String },
      photoPath: { type: String },
      blockedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
      contacts: [{ type: Schema.Types.ObjectId, ref: "User" }],
      groups: [{ type: Schema.Types.ObjectId, ref: "Group" }],
    });

    schema.index({ userName: 1 });
    schema.index({ groups: 1 });

    this._model = mongoose.model<Document>("User", schema);
  }

  public get model(): Model<Document> {
    return this._model;
  }
}
