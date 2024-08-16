import { Router } from "express";
import { UserController } from "../../controllers/user.controller";
import { forgotPasswordValidator, loginValidator, profileEditingValidator, registerValidator, resetPasswordValidator, userSearchValidator } from "../../middlewares/validation.middleware";
import { UserService } from "../../services/business_services/user.service";
import { UserRepository } from "../../database/repositories/user.repository";
import { checkUser } from "../../middlewares/auth.middleware";
import { uploadMiddleware } from "../../middlewares/upload.middleware";

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
      .post("/", uploadMiddleware, registerValidator, this.userController.register)
      .bind(this.userController);

      this.router   
      .get("/", this.userController.getUsersWithPagination)
      .bind(this.userController);

      this.router   
      .get("/search", userSearchValidator, this.userController.searchForUsers)
      .bind(this.userController);

      this.router   
      .post("/verification", this.userController.verifyAccount)
      .bind(this.userController);

      this.router
      .post("/login", loginValidator, this.userController.login)
      .bind(this.userController);

      this.router
      .get("/profile", checkUser, this.userController.showProfile)
      .bind(this.userController);

      this.router
      .put("/profile", checkUser, uploadMiddleware, profileEditingValidator,this.userController.editProfile)
      .bind(this.userController);

      this.router
      .post("/password", checkUser, resetPasswordValidator, this.userController.resetPassword)
      .bind(this.userController);

      this.router
      .post("/forgot-password-token", checkUser, this.userController.sendForgotPasswordToken)
      .bind(this.userController);

      this.router
      .post("/password/forgotten/:resetToken", checkUser, forgotPasswordValidator, this.userController.forgotPassword)
      .bind(this.userController);

      this.router
      .post("/tokens", this.userController.generateNewTokens)
      .bind(this.userController);

      
      this.router
      .post("/contacts", checkUser, this.userController.addFriend)
      .bind(this.userController);

      this.router
      .patch("/contacts", checkUser, this.userController.removeFriend)
      .bind(this.userController);

      this.router
      .get("/contacts", checkUser, this.userController.getUserContacts)
      .bind(this.userController);

      this.router
      .post("/block", checkUser, this.userController.blockUser)
      .bind(this.userController);

      this.router
      .patch("/block", checkUser, this.userController.unblockUser)
      .bind(this.userController);

    
  }
  
}

export default new UserRoute().router;
