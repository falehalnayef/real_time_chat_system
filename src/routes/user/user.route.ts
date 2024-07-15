import { Router } from "express";
import { UserController } from "../../controllers/user.controller";
import { loginValidator, registerValidator } from "../../middlewares/validation.middleware";
import { UserService } from "../../services/business_services/user.service";
import { UserRepository } from "../../database/repositories/user.repository";

class UserRoute {
  router: Router;
  private userController: UserController;
  constructor() {
    this.router = Router();
    this.userController = new UserController(
      new UserService(new UserRepository())
    );

    this.initRoutes();
  }

  private initRoutes() {
    this.router
      .post("/", registerValidator, this.userController.register)
      .bind(this.userController);

      this.router
      .post("/login", loginValidator, this.userController.login)
      .bind(this.userController);
  }
  
}     

export default new UserRoute().router;
