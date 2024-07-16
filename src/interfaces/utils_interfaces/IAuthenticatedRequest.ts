import { Request } from "express";
import { Auth } from "../../types/auth.type";
import { FileInfo } from "../../types/fileInfo.type";
export default interface AuthenticatedRequest extends Request {
  files: FileInfo[];
  auth?: Auth;
}
