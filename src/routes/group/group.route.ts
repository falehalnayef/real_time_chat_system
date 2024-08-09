import { Router } from "express"
import { checkUser } from "../../middlewares/auth.middleware";
import { uploadMiddleware } from "../../middlewares/upload.middleware";
import { GroupController } from "../../controllers/group.controller";
import { GroupService } from "../../services/business_services/group.service";
import { GroupRepository } from "../../database/repositories/group.repository";
import { groupCreationValidator } from "../../middlewares/validation.middleware";

class GroupRoute {
  router: Router;
  private groupController: GroupController;
  constructor() {
    this.router = Router();
    this.groupController = new GroupController(
      new GroupService(new GroupRepository())
    );

    this.initRoutes();
  }

  private initRoutes() {
    this.router   
      .post("/", checkUser, uploadMiddleware, groupCreationValidator, this.groupController.createGroup)
      .bind(this.groupController);
  }
  
}

export default new GroupRoute().router;
