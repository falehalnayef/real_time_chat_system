import { NextFunction, Response, Request } from "express";
import { failureResponse } from "../utils/response";

export default (err: any, _req: Request, res: Response, next: NextFunction) =>{

    if(!err) return next();
    let status = err.statusCode || 500;
    if(err.message == "jwt expired") status = 403;
    res.status(status).send(failureResponse(err.message));

}
