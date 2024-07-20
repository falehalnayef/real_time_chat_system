import { Router } from "express";
import { UserController } from "../../controllers/user.controller";
import { loginValidator, profileEditingValidator, registerValidator } from "../../middlewares/validation.middleware";
import { UserService } from "../../services/business_services/user.service";
import { UserRepository } from "../../database/repositories/user.repository";
import { checkUser } from "../../middlewares/auth.middleware";
import UploadMiddleWare from "../../middlewares/upload.middleware";

class UserRoute {
  router: Router;
  private userController: UserController;
  private uploadMiddleware: UploadMiddleWare;
  constructor() {
    this.router = Router();
    this.userController = new UserController(
      new UserService(new UserRepository())
    );

     this.uploadMiddleware = new UploadMiddleWare();
    this.initRoutes();
  }

  private initRoutes() {
    this.router
      .post("/", this.uploadMiddleware.handleFileUpload, registerValidator, this.userController.register)
      .bind(this.userController);

      this.router
      .post("/login", loginValidator, this.userController.login)
      .bind(this.userController);

      this.router
      .get("/profile", checkUser, this.userController.showProfile)
      .bind(this.userController);

      this.router
      .post("/profile", checkUser, profileEditingValidator,this.userController.editProfile)
      .bind(this.userController);
  }
  
}

export default new UserRoute().router;
