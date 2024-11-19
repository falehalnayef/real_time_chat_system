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
import { io } from "socket.io-client";
dotenv.config();

export class UserService{
    
private cloudinaryImageFolder: string = process.env.CLOUDINARY_USER_PROFILE_IMAGES_FOLDER!;
private userRepository: IUserRepository;

constructor(userRepository: IUserRepository){
    this.userRepository = userRepository;
} 
     async register(userName: string, email: string, password: string, bio: string, image: FileInfo) {


        const hashedPassword = hashData(password);

        let url: string | undefined;
        if(image){
         url =  await uploadToCloudinary(image.data!, "image", String(this.cloudinaryImageFolder));
        }
        const otpObject = generateOTP();

        await this.userRepository.addUser(userName, email, await hashedPassword, otpObject.code, otpObject.otpExpiresIn, bio, url);

        sendEmail(email, "Account verification.", `OTP to verify your account is: ${otpObject.code} \n it expires in 5 minutes`);

      }

      async sendNewOtp(email: string) {

        if(!email) throw new StatusError(400, "EMAIL is required");   

        const user = await this.userRepository.getUserByEmail(email);
        if(!user) throw new StatusError(401, "Email not found.");

        if(user.isActive) throw new StatusError(400, "User is already active.");
      
        const otpObject = generateOTP();

        user.otp = otpObject.code;
        user.otpExpiresIn = otpObject.otpExpiresIn;

        await this.userRepository.updateUser(user);

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
          const socket = io();
          socket.emit('register', user._id);
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

        if(user.photoPath){
          const public_id = user.photoPath.match(new RegExp(`${this.cloudinaryImageFolder}/(.*?)(?=\\.[^.]*$)`))?.[0]!;

          await deleteFromCloudinary(public_id);
        }
       
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
        
          if (!user) throw new StatusError(404, "Email not found.");
        
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
          if(user.id === friendId) throw new StatusError(400, "You can not add yourself.");

          const friend = await this.userRepository.getUserById(friendId);
          if(!friend) throw new StatusError(404, "User not found.");
        
      
          const e = user.contacts.filter((id) => id == friendId);

          if (e.length != 0) throw new StatusError(400, "This user is already in your contacts.");
          

          user.contacts.push(friendId);   
          await this.userRepository.updateUser(user);

        }

        async removeFriend(user: IUser, friendId: ObjectId){

          if(!friendId) throw new StatusError(400, "UserId is required.");
          const friend = await this.userRepository.getUserById(friendId);
          if(!friend) throw new StatusError(404, "User not found.");
          
          
              user.contacts = user.contacts.filter((id) => id.toString() !== friendId.toString());
          
          
          await this.userRepository.updateUser(user);

        } 

        async blockUser(user: IUser, userId: ObjectId){

          if(!userId) throw new StatusError(400, "UserId is required.");

          if(user.id === userId) throw new StatusError(400, "You can not block yourself.");

          const userToBlock = await this.userRepository.getUserById(userId);
          if(!userToBlock) throw new StatusError(404, "User not found.");
         
          const e = user.blockedUsers.filter((id) => id == userId);

          if (e.length != 0) throw new StatusError(400, "This user is already blocked.");

          user.blockedUsers.push(userId);
          await this.userRepository.updateUser(user);

        }



        async unblockUser(user: IUser, userId: ObjectId){

          if(!userId) throw new StatusError(400, "UserId is required.");
          const userToUnblock = await this.userRepository.getUserById(userId);
          if(!userToUnblock) throw new StatusError(404, "User not found.");
          user.blockedUsers = user.blockedUsers.filter((id) => id.toString() !== userId.toString());
          await this.userRepository.updateUser(user);

        }

      
        async getUsersWithPagination(user: IUser, page: number, limit: number) {

          if(!page || !limit) throw new StatusError(400, "page and limit are required.");
          
        if (page < 1) page = 1;
        if (limit < 1) limit = 10;

          const skip = (page - 1) * limit;
      
          let [users, total] = await Promise.all([
              this.userRepository.getUsers({_id:{$ne: user._id}, isActive: true}, skip, limit),
              this.userRepository.countUsers({isActive: true})
          ]);
          total -= 1;
          return { users, total };                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
      } 

      async searchForUsers(user: IUser, email: string, userName: string) {
      
        let query: any= { _id: { $ne: user._id }, isActive: true };

        if (email) {
          query.email = 
          { $regex: email, $options: "i" };
        }

        if (userName) {
          query.userName = { $regex: userName, $options: "i" };
        }

        const users = await this.userRepository.getUsers(query);
        return users;
      }
      
      async getUserContacts(userId: ObjectId){
        const obj = await this.userRepository.getUserContactsById(userId);
        const contacts = obj!.contacts;

        return await this.userRepository.getUsers({_id:{$in:contacts}});
      }

      async getUserBlockedUsers(userId: ObjectId){
        const obj = await this.userRepository.getUserBlockedUsersById(userId);

        const blockedUsers = obj!.blockedUsers;   

        return await this.userRepository.getUsers({_id:{$in:blockedUsers}});
      }

      async deleteAccount(user: IUser, password: string) {


        const checkPass = compareData(password, user.password);

        if(!(await checkPass)) throw new StatusError(401, "Wrong password.");

        await this.userRepository.delete(String(user._id));

      }

} 