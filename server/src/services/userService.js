import AppError from "../errors/AppError.js";
import { hashPassword } from "../auth/passwords.js";
import { signAccessToken } from "../auth/tokens.js";
import { create } from "../repositories/userRepository.js";

export async function register({ email, name, password }) {
  if (!email || !name || !password) {
    throw AppError.validation("Invalid User, Email or Password.");
  }

  if (password.length < 8) {
    throw AppError.validation("The password must be at least 8 characters long.");
  }

  const passwordHash = await hashPassword(password);

  try {
    const user = await create({ email, name, passwordHash });
    const token = signAccessToken(user);
    return { user, token };
  } catch (err) {
    // email is marked as unique in our migration table. duplicates will be flagged by Postgres as 23505.
    if (err.code === "23505") {
      throw AppError.conflict("Invalid Email."); 
    }
    throw err;
  }
}
