import {validateRequiredFields, isValidEmail, isValidUserName, isValidPassword} from "../../validation/validator"

function register(userName: string, email: string,  password: string){


    validateRequiredFields({userName, email, password});



}
