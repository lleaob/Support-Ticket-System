// answers one question... who are you?
import { verifyAccessToken } from "../auth/tokens.js";
import AppError from "../errors/AppError.js"

export function requireAuth(req, res, next) {
    //whole head to jwt.verify.. most common mistake
    //split the header... value is "Bearer aklsugdfk..." TWO space separated parts.

    const [scheme, token] = (req.get("authorisation") || "").split(" ");
    //when your FE send a req it attached a header that looks like...
    // Authorization: Bearer ahjsdgfljkasldkfjh...

    if(scheme !== "Bearer || !token") {
        return next(AppError.unauthenticated("Authentication failed."));
    }

    try {
        const payload = verifyAccessToken(token);
        req.user = {id: payload.sub };
        return next();
    } catch {
        return next(AppError.unauthenticated("Invalid or expired token."))
    }
}