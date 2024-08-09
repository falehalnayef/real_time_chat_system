import { NextFunction, Response } from "express";
import IAuthenticatedRequest from "../interfaces/utils_interfaces/IAuthenticatedRequest";
import { successResponse } from "../utils/response";
import { GroupService } from "../services/business_services/group.service";

export class GroupController {
  private groupService: GroupService;
  constructor(groupService: GroupService) {
    this.groupService = groupService;

  }

  async createGroup(
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {

        const user = req.auth!.user;

      const { groupName, bio } = req.body;

      const files = req.files!;

      await this.groupService.createGroup(user, groupName, bio, files[0]);

      res.status(201).send(successResponse("Group has been created."));
    } catch (error: any) {
      next(error);
    }
  }

  async removeGroup(
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {

        const user = req.auth!.user;

      const { groupId } = req.params;

      await this.groupService.removeGroup(user, groupId);

      res.status(200).send(successResponse("Group has been deleted."));
    } catch (error: any) {
      next(error);
    }
  }


  async addUserToGroup(
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {

        const user = req.auth!.user;

      const { groupId } = req.params;

      const { userId } = req.body;


      await this.groupService.addUserToGroup(user, groupId, userId);

      res.status(200).send(successResponse("User has been added to the group."));
    } catch (error: any) {
      next(error);
    }
  }
} 
