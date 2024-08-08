import { NextFunction, Response } from "express";
import IAuthenticatedRequest from "../interfaces/utils_interfaces/IAuthenticatedRequest";
import { UserService } from "../services/business_services/user.service";
import { successResponse } from "../utils/response";
import { User } from "../dto/user.dto";

export class UserController {
  private userService: UserService;
  constructor(userService: UserService) {
    this.userService = userService;
    this.register = this.register.bind(this);

  }

  async register(
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userName, email, password, bio } = req.body;

      const files = req.files!;

      await this.userService.register(userName, email, password, bio, files[0]);

      res.status(201).send(successResponse("User is registered."));
    } catch (error: any) {
      next(error);
    }
  }

  
  async login(
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, password } = req.body;

      const data = await this.userService.login(email, password);

      res.status(200).send(successResponse("User is logged in.", data));
    } catch (error: any) {
      next(error);
    }
  }


  async showProfile(
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {

      const user = req.auth!.user;
   

      const profile = await this.userService.getProfile(user._id);

      res.status(200).send(successResponse("Profile.", new User(profile)));
    } catch (error: any) {
      next(error);
    }
  }

  async editProfile(
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {

      const user = req.auth!.user;
      const files = req.files

      let updatedData = req.body;
      
      if(files){
        updatedData.image = files[0];
      }

      await this.userService.editProfile(user, updatedData);

      res.status(200).send(successResponse("Profile has been edited."));
    } catch (error: any) {
      next(error);
    }
  }

  async verifyAccount(
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      
      const {otp} = req.body;

      await this.userService.verifyAccount(otp);

      res.status(200).send(successResponse("Account has been verified."));
    } catch (error: any) {
      next(error);
    }
  }

  async resetPassword(
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {

      const {oldPassword, newPassword} = req.body;

      const user = req.auth!.user;

      await this.userService.resetPassword(user, oldPassword, newPassword);

      res.status(200).send(successResponse("Password has been reset."));
    } catch (error: any) {
      next(error);
    }
  }

  async sendForgotPasswordToken(
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {

      const {email} = req.body;

      await this.userService.sendForgotPasswordToken(email);

      res.status(200).send(successResponse("Check your email for reset token."));
    } catch (error: any) {
      next(error);
    }
  }
  
  async forgotPassword(
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {

      const {newPassword} = req.body;

      const {resetToken} = req.params;


      await this.userService.resetForgottenPassword(resetToken, newPassword);

      res.status(200).send(successResponse("Password has been reset."));
    } catch (error: any) {
      next(error);
    }
  }

  async generateNewTokens(
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {

      const {refreshToken} = req.body;

      const tokens = await this.userService.generateNewTokens(refreshToken);

      res.status(200).send(successResponse("Tokens have been refreshed.", await tokens));
    } catch (error: any) {
      next(error);
    }
  }

  async addFriend(
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {

      const user = req.auth!.user;

      const {friendId} = req.body;

       await this.userService.addFriend(user, friendId);

      res.status(200).send(successResponse("User has been added to your contacts."));
    } catch (error: any) {
      next(error);
    }
  }

  async removeFriend(
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {

      const user = req.auth!.user;

      const {friendId} = req.body;

      await this.userService.removeFriend(user, friendId);

      res.status(200).send(successResponse("User has been removed from your contacts."));
    } catch (error: any) {
      next(error);
    }
  }

  async blockUser(
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {

      const user = req.auth!.user;

      const {userId} = req.body;

      await this.userService.blockUser(user, userId);

      res.status(200).send(successResponse("User has been blocked."));
    } catch (error: any) {
      next(error);
    }
  }
} 
