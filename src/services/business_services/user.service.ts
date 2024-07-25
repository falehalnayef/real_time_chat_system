import { compareData, hashData } from "../utils_services/bcrypt.service";
import { UserRepository } from "../../database/repositories/user.repository";
import StatusError from "../../utils/statusError";
import { generateAccessToken } from "../utils_services/jwt.service";
import { IUser, IUserRepository } from "../../interfaces/business_interfaces/IUser";
import { FileInfo } from "../../types/fileInfo.type";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils_services/cloudinary.service";
import dotenv from "dotenv";
import { sendEmail } from "../utils_services/mail.service";
import { generateOTP } from "../utils_services/otp-generator.service";
dotenv.config();

export class UserService{
    
private cloudinaryImageFolder: string = process.env.CLOUDINARY_USER_PROFILE_IMAGES_FOLDER!;
private userRepository: IUserRepository;

constructor(userRepository: IUserRepository){
    this.userRepository = userRepository;
}
     async register(userName: string, email: string, password: string, bio: string, image: FileInfo) {


        const hashedPassword = hashData(password);

        const url = uploadToCloudinary(image.data!, "image", String(this.cloudinaryImageFolder));

        const otpObject = generateOTP();

        await this.userRepository.addUser(userName, email, await hashedPassword, bio, await url, otpObject.code, otpObject.otpExpiresIn);

        sendEmail(email, "Account verification.", `OTP to verify your account is: ${otpObject.code} \n it expires in 5 minutes`);

      }

      async verifyAccount(otp: string) {

        if(!otp) throw new StatusError(400, "OTP is required.");      
        const user = await this.userRepository.getUserByOTP(otp);

        if(!user) throw new StatusError(404, "User not found.");

        if(user.isActive) throw new StatusError(400, "User is already active.");

        if(!(user.otp) || !(user.otpExpiresIn)) throw new StatusError(400, "OTP is invalid.")
      
        if (user.otpExpiresIn < new Date()) throw new StatusError(400, "OTP is invalid.");
      
        user.isActive = true;
        user.otp = undefined;
        user.otpExpiresIn = undefined;

        await this.userRepository.updateUser(user);


      }

      async login(email: string, password: string) {
            
         const user = await this.userRepository.getUserByEmail(email);
          if(!user) throw new StatusError(401, "Invalid credentials.");
          const checkPass = compareData(password, user.password);
          if(!(await checkPass)) throw new StatusError(401, "Invalid credentials.");

          if(!user.isActive) throw new StatusError(401, "You must Activate your account.");
          const accessToken = generateAccessToken(user._id);

          return {id: user._id, name: user.userName, accessToken};

        }


        async editProfile(user: IUser, updatedData: any) {

          const {userName, image, bio} = updatedData;

          if(userName){         
            user.userName = userName;
          }

          if(image){
        const url = await uploadToCloudinary(image.data!, "image", String(this.cloudinaryImageFolder));         

        const public_id = user.pohtoPath.match(new RegExp(`${this.cloudinaryImageFolder}/(.*?)(?=\\.[^.]*$)`))?.[0]!;

        await deleteFromCloudinary(public_id);

           user.pohtoPath = url;
        
          }

          if(bio){
         
            user.bio = bio;
          }

          await this.userRepository.updateUser(user);

     
         }
      

} 