import bcrypt from "bcrypt";
import env from "dotenv";
env.config();

export async function hashData(plainData: string): Promise<string>{
    return await bcrypt.hash(plainData, Number(process.env.SALT_ROUNDS!));
}

export async function compareData(plainData: string, encryptedDate: string): Promise<boolean>{
    return await bcrypt.compare(plainData, encryptedDate);
}           