import { Router } from "express";
import { register } from "../services/userService.js";

const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    const {email, name, password } = req.body || {};
    const {user, token } = await register({ email, name, password });
    res.status(201).json({ user, token});
  } catch (err) {
    next(err);
  }
});

export default router;
