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
      const { userName, email, password } = req.body;

      await this.userService.register(userName, email, password);

      res.status(201).send(successResponse("User is registered"));
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

      res.status(200).send(successResponse("User is logged in", data));
    } catch (error: any) {
      next(error);
    }
  }
}
