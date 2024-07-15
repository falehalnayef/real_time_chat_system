import StatusError from "../utils/statusError";

export function validateRequiredFields(fields: Record<string, any>): void {
    for (const key in fields) {
        if (!fields[key]) {
            throw new StatusError(400, `${key.toUpperCase()} is required.`);
        }
    }
}

export function isValidUserName(userName: string): boolean {
    
    const regex = /^[a-zA-Z0-9_-]+$/;
    return regex.test(userName);
}


export function isValidEmail(email: string): boolean {
      
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export function isValidPassword(password: string): boolean {

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;       
    return regex.test(password);
}

