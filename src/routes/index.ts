import { Router } from "express";
import userRoutes from "./user/user.route";

class IndexRouter {
  router: Router;

  constructor() {
    this.router = Router();

    this.initRoutes();
  }
  initRoutes() {
    this.router.use("/users", userRoutes);
  }
}

export default new IndexRouter().router;
