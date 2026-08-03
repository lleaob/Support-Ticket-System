// exchange credentials for a token, and give an attacker nothing
import * as userRepository from "../repositories/userRepository.js";
import AppError from "../errors/AppError.js"
import {verifyPassword} from "../auth/passwords.js"
import { signAccessToken } from "../auth/tokens.js"
import { sign } from "jsonwebtoken";

const DUMMY_HASH = "$2b$12$3mGbr4x0qYjflmwTd8cD7.suq4dIj1HBdEERRB3RqFJTI50Fi2tXW";

export async function login({ email, password }) {
  const account = await userRepository.findByEmailWithHash(email || "");
  const genericFailure = () => AppError.unauthenticated("Invalid email or password.");

  if (!account) {
    await verifyPassword(password, DUMMY_HASH); // using bcrypt to slowdown the response
    throw genericFailure();
  }

  const ok = await verifyPassword(password, account.password_hash)
  if (!ok) throw genericFailure();

  await userRepository.touchLastLogin(account.id);

  const user = await userRepository.findById(account.id);
  return { user, token: signAccessToken(user) };
}


// let a client ask "is this stored token still good, and whose is it"
export async function getCurrentUser(userId) {
  const user = await userRepository.findById(userId);
  if (!user) throw AppError.notFound("User NOT found.")
  return user;
}