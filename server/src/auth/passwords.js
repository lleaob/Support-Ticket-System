// implementation of bcrypt
// hash a password for storage and check an attempt against a stored hash

import bcrypt from "bcryptjs"
import config from "../config/index.js"

// hash
export async function hashPassword(plainText){
    if (typeof plainText !== "string" || plainText.length < 8) {
        throw new Error ("Password must be longer than 8 characters")
    }
    return bcrypt.hash(plainText, config.bcryptRounds);
}

// verify
export async function verifyPassword(plainText, hash) {
    if (!plainText || !hash) return false;
    return bcrypt.compare(plainText, hash);
}