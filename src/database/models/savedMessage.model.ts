import mongoose, { Schema } from "mongoose";
import { ISavedMessageDocument, ISavedMessageModel } from "../../interfaces/ISavedMessage";

export class SavedMessageModel {
  private _model: ISavedMessageModel;

  constructor() {
    const schema = new Schema({
      user: { type: Schema.Types.ObjectId, ref: "User" },
      date: { type: Date, required: true },
      message: {
        type: {
          type: { type: String, enum: ["text", "file", "video", "voice"], required: true },
          text: { type: String },
          file: {
            name: { type: String },
            type: { type: String },
            filePath: { type: String },
          },
          video: {
            name: { type: String },
            type: { type: String },
            videoPath: { type: String },
          },
          voice: {
            name: { type: String },
            type: { type: String },
            voicePath: { type: String },
          },
        },
      },
    });
    schema.index({ user: 1 });
    schema.index({ 'messages.type': 1 });
    
    this._model = mongoose.model<ISavedMessageDocument>("SavedMessage", schema);
  }

  public get model(): ISavedMessageModel {
    return this._model;
  }
}
