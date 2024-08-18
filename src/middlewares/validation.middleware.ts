import { NextFunction, Response } from "express";
import AuthenticatedRequest from "../interfaces/utils_interfaces/IAuthenticatedRequest";
import { isValidEmail, isValidName, isValidPassword, validateRequiredFields } from "../validation/validator";
import StatusError from "../utils/statusError";

export function registerValidator(req: AuthenticatedRequest, _res: Response, next: NextFunction){

    try {

        const {userName, email, password} = req.body;

        validateRequiredFields({userName, email, password});

        if(!isValidName(userName)) throw new StatusError(400, "Invalid userName format.");
        if(!isValidEmail(email)) throw new StatusError(400, "Invalid email format.");
        if(!isValidPassword(password)) throw new StatusError(400, "Invalid password format.");

                next();

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

                next();

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
            if(!isValidName(userName)) throw new StatusError(400, "Invalid userName format.");
        }
     
                next();

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

                next();

    } catch (error: any) {
        
        next(error);
    }

}

export function forgotPasswordValidator(req: AuthenticatedRequest, _res: Response, next: NextFunction){

    try {

        const {newPassword} = req.body;

        const {resetToken} = req.params;

        validateRequiredFields({resetToken, newPassword});

        if(!isValidPassword(newPassword)) throw new StatusError(400, "Invalid new password format.");

                next();
    } catch (error: any) {
        
        next(error);
    }

}

export function groupCreationValidator(req: AuthenticatedRequest, _res: Response, next: NextFunction){

    try {

        const {groupName} = req.body;

        validateRequiredFields({groupName});

        if(!isValidName(groupName)) throw new StatusError(400, "Invalid groupName format.");

                next();        

    } catch (error: any) {
        
        next(error);
    }

}


export function groupInfoEditingValidator(req: AuthenticatedRequest, _res: Response, next: NextFunction){

    try {

        const {groupName, pohtoPath, bio, isPrivate} = req.body;

        const {groupId} = req.params;

        const image = req.files;

        if(!groupId && !groupName && !pohtoPath && !bio && !image && (isPrivate == undefined)) throw new StatusError(400, "Edit somthing.");

        if(groupName){
            if(!isValidName(groupName)) throw new StatusError(400, "Invalid groupName format.");
        }
     
                next();

    } catch (error: any) {
        
        next(error);
    }
}


    
export function userSearchValidator(req: AuthenticatedRequest, _res: Response, next: NextFunction){

    try {


        const {email, userName} = req.query;


        if(!email && !userName) throw new StatusError(400, "Enter email or userName.");

        if(email){
            if(!isValidEmail(email as string)) throw new StatusError(400, "Invalid email format.");
        }

        if(userName){
            if(!isValidName(userName as string)) throw new StatusError(400, "Invalid userName format.");
        }
     
                next();

    } catch (error: any) {
        
        next(error);
    }
}
    