import { NextFunction, Response } from "express";
import AuthenticatedRequest from "../interfaces/utils_interfaces/IAuthenticatedRequest";
import { isValidEmail, isValidPassword, isValidUserName, validateRequiredFields } from "../validation/validator";
import StatusError from "../utils/statusError";

export function registerValidator(req: AuthenticatedRequest, _res: Response, next: NextFunction){

    try {

        const {userName, email, password} = req.body;

        validateRequiredFields({userName, email, password});

        if(!isValidUserName(userName)) throw new StatusError(400, "Invalid userName format.");
        if(!isValidEmail(email)) throw new StatusError(400, "Invalid email format.");
        if(!isValidPassword(password)) throw new StatusError(400, "Invalid password format.");

        next()


    } catch (error: any) {
        
        next(error);
    }

}