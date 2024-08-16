import { NextFunction, Response } from "express";
import IAuthenticatedRequest from "../interfaces/utils_interfaces/IAuthenticatedRequest";
import { successResponse } from "../utils/response";
import { GroupService } from "../services/business_services/group.service";
import { ObjectId } from "mongoose";

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

      const { groupName, bio, isPrivate } = req.body;

      const files = req.files!;

      await this.groupService.createGroup(user, groupName, bio, isPrivate, files[0]);

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

      const { groupId, userId } = req.params;

      await this.groupService.addUserToGroup(user, groupId, userId as unknown as ObjectId);

      res.status(200).send(successResponse("User has been added to the group."));
    } catch (error: any) {
      next(error);
    }
  }

  async removeUserFromGroup(
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {

        const user = req.auth!.user;

      const { groupId,userId } = req.params;

      await this.groupService.removeUserFromGroup(user, groupId, userId as unknown as ObjectId);

      res.status(200).send(successResponse("User has been removed from the group."));
    } catch (error: any) {
      next(error);
    }
  }


  async joinPublicGroup(
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {

        const user = req.auth!.user;

      const { groupId } = req.params;

      await this.groupService.joinPublicGroup(user, groupId);

      res.status(200).send(successResponse("User has joined the group."));
    } catch (error: any) {
      next(error);
    }
  }


  async leaveGroup(
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {

        const user = req.auth!.user;

      const { groupId } = req.params;

      await this.groupService.leaveGroup(user, groupId);

      res.status(200).send(successResponse("User has left the group."));
    } catch (error: any) {
      next(error);
    }
  }


  async getGroupInfo(
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {

        const user = req.auth!.user;

      const { groupId } = req.params;

     const group = this.groupService.getGroupInfo(user, groupId);

      res.status(200).send(successResponse("Group info.", await group));
    } catch (error: any) {
      next(error);
    }
  }

  async editGroupInfo(
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {

    const user = req.auth!.user;

      const { groupId } = req.params;

      const files = req.files

      let updatedData = req.body;
      
      if(files){
        updatedData.image = files[0];
      }


     await this.groupService.editGroupInfo(user, groupId, updatedData);

      res.status(200).send(successResponse("Group info has been edited."));
    } catch (error: any) {
      next(error);
    }
  }


  async getGroups(
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {

        const user = req.auth!.user;

      const { type } = req.query;

     const groups = this.groupService.getGroups(user, type);

      res.status(200).send(successResponse("Groups.", await groups));
    } catch (error: any) {
      next(error);
    }
  }
  async searchForPublicGroups(
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {

      const { groupName } = req.query;

      const groups = this.groupService.searchForPublicGroups(groupName as string);

      res.status(200).send(successResponse("Groups.", await groups));
    } catch (error: any) {
      next(error);
    }
  }

} 
