import busboy from "busboy";
import { Response, NextFunction } from "express";
import AuthenticatedRequest from "../interfaces/utils_interfaces/IAuthenticatedRequest";
import StatusError from "../utils/statusError";
import { FileInfo } from "../types/fileInfo.type";
 

export function uploadMiddleware(
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction
  ) {

    const allowedMimeTypes = [
      "image/png",
      "image/jpeg"
    ];
    const allowedSizeInBytes = 10 * 1024 * 1024;

    const bb = busboy({ headers: req.headers });

    const files: FileInfo[] = [];
    bb.on("field", (fieldname, value) => {
      req.body[fieldname] = value;
    });

    bb.on("file", (fieldName: string, file: any, info: any) => {
      const fileInfo: FileInfo = {
        fieldName,
        fileName: info.filename,
        encoding: info.encoding,
        mimetype: info.mimeType,    
        data: Buffer.from([]),
      };

      const chunks: Buffer[] = [];
      file
        .on("data", (chunk: Buffer) => {
          chunks.push(chunk);
        })
        .on("end", () => {
          const buffer = Buffer.concat(chunks);

          fileInfo.data = buffer;
          if (
            fileInfo &&
            !allowedMimeTypes.includes(fileInfo.mimetype)
          ) {
          

            next(new StatusError(400, "File type not allowed"));

            return;
          }

          const fileSize = fileInfo ? fileInfo.data?.length : 0;
          if (fileSize && fileSize > allowedSizeInBytes) {
            next(new StatusError(400, "File size exceeds limit"));

            return;
          }

          files.push(fileInfo);
        });
    });

    bb.on("finish", () => {
      req.files = files;

      next();
    });

    bb.on("error", (error: any) => {
      next(new StatusError(500, error.message));
      return;
    });
    req.pipe(bb);
  }


