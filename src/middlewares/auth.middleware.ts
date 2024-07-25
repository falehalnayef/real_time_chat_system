import {NextFunction, Response } from "express";
import AuthenticatedRequest from "../interfaces/utils_interfaces/IAuthenticatedRequest";
import { UserRepository } from "../database/repositories/user.repository";
import StatusError from "../utils/statusError";
import { verifyToken } from "../services/utils_services/jwt.service";

const userRepository = new UserRepository();

export async function checkUser(req: AuthenticatedRequest, _res: Response, next: NextFunction){

    try {

        const token = req.headers.authorization;

        if(!token) throw new StatusError(400, "Token is required.");

         const decoded = verifyToken(token!);
        const user = await userRepository.getUserById(decoded._id);
        if(!user) throw new StatusError(403, "forbidden.");
        if(!user.isActive) throw new StatusError(401, "You must activate your account.");

        req.auth = {user};

        next()


    } catch (error: any) {
        
        next(error);
    }

}