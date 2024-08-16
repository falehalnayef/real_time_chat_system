import { compareData, hashData } from "../utils_services/bcrypt.service";
import StatusError from "../../utils/statusError";
import { IUser, IUserRepository } from "../../interfaces/business_interfaces/IUser";
import { FileInfo } from "../../types/fileInfo.type";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils_services/cloudinary.service";
import dotenv from "dotenv";
import { sendEmail } from "../utils_services/mail.service";
import { generateOTP } from "../utils_services/otp-generator.service";
import { generateToken, verifyToken } from "../utils_services/jwt.service";
import { ObjectId } from "mongoose";
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

          if(!user.isActive) throw new StatusError(401, "You must activate your account.");
          const accessToken = generateToken(user._id, process.env.JWT_ACCESS_SECRET!, process.env.JWT_ACCESS_EXPIRATION_TIME!);
          const refreshToken = generateToken(user._id, process.env.JWT_REFRESH_SECRET!, process.env.JWT_REFRESH_EXPIRATION_TIME!);


          return {id: user._id, name: user.userName, accessToken, refreshToken};

        }

        async getProfile(userId: ObjectId){
          const profile = await this.userRepository.getUserProfileById(userId);
          if(!profile) throw new StatusError(404,"User profile not found.");
          return profile;
        }

        async editProfile(user: IUser, updatedData: any) {

          const {userName, image, bio} = updatedData;

          if(userName){         
            user.userName = userName;
          }

          if(image){
        const url = await uploadToCloudinary(image.data!, "image", String(this.cloudinaryImageFolder));         

        const public_id = user.photoPath.match(new RegExp(`${this.cloudinaryImageFolder}/(.*?)(?=\\.[^.]*$)`))?.[0]!;

        await deleteFromCloudinary(public_id);

           user.photoPath = url;
        
          }

          if(bio){
         
            user.bio = bio;
          }

          await this.userRepository.updateUser(user);

     
         }
      
         async resetPassword(user: IUser, oldPassword: string, newPassword: string){


          const checkPass = compareData(oldPassword, user.password);

          if(!(await checkPass)) throw new StatusError(401, "Invalid credentials.");

          const hashedPassword = hashData(newPassword);

          user.password = await hashedPassword;

          await this.userRepository.updateUser(user);

         }      

         async sendForgotPasswordToken(email: string) {

          if(!email) throw new StatusError(400, "Email is required.");
          const user = await this.userRepository.getUserByEmail(email);
        
          if (!user) throw new StatusError(404, "User not found.");
        
          const resetToken = generateToken(user._id, process.env.JWT_RESETPASSWORD_SECRET!, process.env.JWT_RESETPASSWORD_EXPIRATION_TIME!);
        
          user.resetPasswordToken = resetToken;
      
          await this.userRepository.updateUser(user);
        
          await sendEmail(user.email, "Password Reset", `Your password reset token is: ${resetToken}`);
        }

        async resetForgottenPassword(resetToken: string, newPassword: string) {
        
        
          const decoded = verifyToken(resetToken, process.env.JWT_RESETPASSWORD_SECRET!);
        
          const user = await this.userRepository.getUserById(decoded._id);
        
          if (!user || (user.resetPasswordToken !== resetToken)) throw new StatusError(400, "Invalid or expired reset token.");
        
          const hashedPassword = await hashData(newPassword);
        
          user.password = hashedPassword;
          user.resetPasswordToken = undefined;
        
          await this.userRepository.updateUser(user);
        }
        
        async generateNewTokens(oldRefreshToken: string){

          if(!oldRefreshToken) throw new StatusError(400, "Refresh token is required.");

          const decoded = verifyToken(oldRefreshToken, process.env.JWT_REFRESH_SECRET!);

          const user = await this.userRepository.getUserById(decoded._id);

          if(!user) throw new StatusError(404, "User not found.");

          const accessToken = generateToken(user._id, process.env.JWT_ACCESS_SECRET!, process.env.JWT_ACCESS_EXPIRATION_TIME!);
          const refreshToken = generateToken(user._id, process.env.JWT_REFRESH_SECRET!, process.env.JWT_REFRESH_EXPIRATION_TIME!);

          return {accessToken, refreshToken};
        }
            

        async addFriend(user: IUser, friendId: ObjectId){

          if(!friendId) throw new StatusError(400, "UserId is required.");
          const friend = await this.userRepository.getUserById(friendId);
          if(!friend) throw new StatusError(404, "User not found.");
          user.contacts.push(friendId);
          await this.userRepository.updateUser(user);

        }
        async removeFriend(user: IUser, friendId: ObjectId){

          if(!friendId) throw new StatusError(400, "UserId is required.");
          const friend = await this.userRepository.getUserById(friendId);
          if(!friend) throw new StatusError(404, "User not found.");
          user.contacts = user.contacts.filter((id) => id !== friendId);
          await this.userRepository.updateUser(user);

        } 

        async blockUser(user: IUser, userId: ObjectId){

          if(!userId) throw new StatusError(400, "UserId is required.");
          const userToBlock = await this.userRepository.getUserById(userId);
          if(!userToBlock) throw new StatusError(404, "User not found.");
          user.blockedUsers.push(userId);
          await this.userRepository.updateUser(user);

        }



        async unblockUser(user: IUser, userId: ObjectId){

          if(!userId) throw new StatusError(400, "UserId is required.");
          const userToUnblock = await this.userRepository.getUserById(userId);
          if(!userToUnblock) throw new StatusError(404, "User not found.");
          user.blockedUsers = user.blockedUsers.filter((id) => id !== userId);
          await this.userRepository.updateUser(user);

        }

      
        async getUsersWithPagination(page: number, limit: number) {

        if (page < 1) page = 1;
        if (limit < 1) limit = 10;

          const skip = (page - 1) * limit;
      
          const [users, total] = await Promise.all([
              this.userRepository.getUsers({}, skip, limit),
              this.userRepository.countUsers({})
          ]);
          return { users, total };
      }
      
} 