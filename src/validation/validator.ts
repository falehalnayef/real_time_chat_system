import StatusError from "../utils/statusError";

export function validateRequiredFields(fields: Record<string, any>): void {
    for (const key in fields) {
        if (!fields[key]) {
            throw new StatusError(400, `${key.toUpperCase()} is required.`);
        }
    }
}

export function isValidUserName(user_name: string): boolean {
    
    const regex = /^[a-zA-Z]{2,}(?: [a-zA-Z]{2,})$/;
    return regex.test(user_name);
}


export function isValidEmail(email: string): boolean {
      
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export function isValidPassword(password: string): boolean {

    const regex =  /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;        
    return regex.test(password);
}