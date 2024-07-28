import bcrypt from "bcrypt";
import env from "dotenv";
env.config();

export async function hashData(plainData: string): Promise<string>{
    return await bcrypt.hash(plainData, process.env.BCRYPT_SALT!);
}

export async function compareData(plainData: string, encryptedDate: string): Promise<boolean>{
    return await bcrypt.compare(plainData, encryptedDate);
}