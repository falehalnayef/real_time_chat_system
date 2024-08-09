import { Router } from "express";
import userRoutes from "./user/user.route";
import groupRoutes from "./group/group.route";

class IndexRouter {
  router: Router;

  constructor() {
    this.router = Router();

    this.initRoutes();
  }
  initRoutes() {
    this.router.use("/users", userRoutes);
    this.router.use("/groups", groupRoutes);

  }
} 

export default new IndexRouter().router;
