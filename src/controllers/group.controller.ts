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
} 
