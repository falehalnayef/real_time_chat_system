import { ResponseMessage } from "../types/responseMessage.type";




export function successResponse(message: string, data?: object): ResponseMessage{

    return {
        status: true,
        message: message,
        data: data
    };
}


export function failureResponse(error: string): ResponseMessage{

    return {
        status: false,
        error: error,
    }
}
