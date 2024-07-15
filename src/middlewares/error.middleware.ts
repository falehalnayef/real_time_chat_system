import { NextFunction, Response } from "express";
import { failureResponse } from "../utils/response";
import AuthenticatedRequest from "../interfaces/utils_interfaces/IAuthenticatedRequest";

export default (err: any, _req: AuthenticatedRequest, res: Response, next: NextFunction) =>{

    if(!err) return next();
    let status = err.statusCode || 500;
    if(err.message == "jwt expired") status = 403;
    res.status(status).send(failureResponse(err.message));

}
