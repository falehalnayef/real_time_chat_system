import { NextFunction, Response } from "express";
import AuthenticatedRequest from "../interfaces/utils_interfaces/IAuthenticatedRequest";
import { isValidEmail, isValidPassword, isValidUserName, validateRequiredFields } from "../validation/validator";
import StatusError from "../utils/statusError";

export function registerValidator(req: AuthenticatedRequest, _res: Response, next: NextFunction){

    try {

        const {userName, email, password, bio} = req.body;
        const files = req.files;

        validateRequiredFields({userName, email, password, bio, files});

        if(!isValidUserName(userName)) throw new StatusError(400, "Invalid userName format.");
        if(!isValidEmail(email)) throw new StatusError(400, "Invalid email format.");
        if(!isValidPassword(password)) throw new StatusError(400, "Invalid password format.");

        next()


    } catch (error: any) {
        
        next(error);
    }

}


export function loginValidator(req: AuthenticatedRequest, _res: Response, next: NextFunction){

    try {

        const {email, password} = req.body;

        validateRequiredFields({email, password});

        if(!isValidEmail(email)) throw new StatusError(400, "Invalid email format.");
        if(!isValidPassword(password)) throw new StatusError(400, "Invalid password format.");

        next()


    } catch (error: any) {
        
        next(error);
    }

}


export function profileEditingValidator(req: AuthenticatedRequest, _res: Response, next: NextFunction){

    try {

        const {userName, pohtoPath, bio} = req.body;

        const image = req.files;

        if(!userName && !pohtoPath && !bio && !image) throw new StatusError(400, "Edit somthing.");

        if(userName){
            if(!isValidUserName(userName)) throw new StatusError(400, "Invalid userName format.");
        }
     
        next()


    } catch (error: any) {
        
        next(error);
    }

}

export function resetPasswordValidator(req: AuthenticatedRequest, _res: Response, next: NextFunction){

    try {

        const {oldPassword, newPassword} = req.body;

        validateRequiredFields({oldPassword, newPassword});

        if(!isValidPassword(oldPassword)) throw new StatusError(400, "Invalid old password format.");
        if(!isValidPassword(newPassword)) throw new StatusError(400, "Invalid new password format.");

        next()

    } catch (error: any) {
        
        next(error);
    }

}

export function forgotPasswordValidator(req: AuthenticatedRequest, _res: Response, next: NextFunction){

    try {

        const {resetToken, newPassword} = req.body;

        validateRequiredFields({resetToken, newPassword});

        if(!isValidPassword(newPassword)) throw new StatusError(400, "Invalid new password format.");

    } catch (error: any) {
        
        next(error);
    }

}