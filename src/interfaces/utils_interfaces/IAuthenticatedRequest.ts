import { Request } from "express";
import { Auth } from "../../types/auth.type";






  export default interface AuthenticatedRequest extends Request {
    auth?: Auth

}

