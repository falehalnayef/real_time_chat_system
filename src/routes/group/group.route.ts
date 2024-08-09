import { Router } from "express"
import { checkUser } from "../../middlewares/auth.middleware";
import { uploadMiddleware } from "../../middlewares/upload.middleware";
import { GroupController } from "../../controllers/group.controller";
import { GroupService } from "../../services/business_services/group.service";
import { GroupRepository } from "../../database/repositories/group.repository";
import { groupCreationValidator } from "../../middlewares/validation.middleware";
import { UserRepository } from "../../database/repositories/user.repository";

class GroupRoute {
  router: Router;
  private groupController: GroupController;
  constructor() {
    this.router = Router();
    this.groupController = new GroupController(
      new GroupService(new GroupRepository(), new UserRepository())
    );

    this.initRoutes();
  }

  private initRoutes() {
    this.router   
      .post("/", checkUser, uploadMiddleware, groupCreationValidator, this.groupController.createGroup)
      .bind(this.groupController);

      this.router   
      .delete("/:groupId", checkUser, this.groupController.removeGroup)
      .bind(this.groupController);


      this.router   
      .post("/:groupId/users/:userId", checkUser, this.groupController.addUserToGroup)
      .bind(this.groupController);

      this.router   
      .delete("/:groupId/users/:userId", checkUser, this.groupController.removeUserFromGroup)
      .bind(this.groupController);

      this.router   
      .post("/:groupId/users", checkUser, this.groupController.joinPublicGroup)
      .bind(this.groupController);

      this.router   
      .delete("/:groupId/users", checkUser, this.groupController.leaveGroup)
      .bind(this.groupController);
  }

  
    
}

export default new GroupRoute().router;
