import { Document, Model, ObjectId } from "mongoose";
import { Message } from "../../types/message.type";

export interface ISavedMessage extends Document {
  user: ObjectId;
  date: Date;
  message: Message;
}

export interface ISavedMessageDocument extends ISavedMessage, Document {}

export interface ISavedMessageModel extends Model<ISavedMessageDocument> {}
