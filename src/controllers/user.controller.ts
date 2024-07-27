import { NextFunction, Response } from "express";
import IAuthenticatedRequest from "../interfaces/utils_interfaces/IAuthenticatedRequest";
import { UserService } from "../services/business_services/user.service";
import { successResponse } from "../utils/response";

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
    
      const data = {
        id: user._id,
        name: user.userName,
        email: user.email,
        pohtoPath: user.pohtoPath,
        bio: user.bio,
        groups: user.groups,
        contacts: user.contacts,
        blockedUsers: user.blockedUsers,
      };

      res.status(200).send(successResponse("Profile.", data));
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

      const {resetToken, newPassword} = req.body;

      await this.userService.resetForgottenPassword(resetToken, newPassword);

      res.status(200).send(successResponse("Password has been reset."));
    } catch (error: any) {
      next(error);
    }
  }
} 
