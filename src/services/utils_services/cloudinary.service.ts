
import {v2 as cloudinary} from "cloudinary";

// need to access this configs via the env file.
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

export function uploadToCloudinary(data: Buffer, resource_type: any, folder: string): Promise<string> {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                resource_type,
                folder,
                transformation: [{ quality: "auto" }],
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result!.url);
                }
            }
        ).end(data);
});
}


export function deleteFromCloudinary(public_id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(public_id, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }
