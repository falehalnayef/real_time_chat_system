import { ResponseMessage } from "../types/responseMessage.type";




function successResponse(message: string, data?: object): ResponseMessage{

    return {
        status: true,
        message: message,
        data: data
    };
}


function failureResponse(error: string): ResponseMessage{

    return {
        status: false,
        error: error,
    }
}

export {successResponse, failureResponse};
