import bcrypt from "bcrypt"

async function hashData(plainData: string): Promise<string>{
    return await bcrypt.hash(plainData, 10);
}

async function compareData(plainData: string, encryptedDate: string): Promise<boolean>{
    return await bcrypt.compare(plainData, encryptedDate);
}