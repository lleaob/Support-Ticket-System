import { Router } from "express";
import healthRouter from "./health.js";
import ticketsRouter from "./tickets.js";
import authRouter from "./auth.js";
import { requireAuth } from "../middleware/requireAuth.js";

const apiRouter = Router();

apiRouter.use("/", healthRouter); // public
apiRouter.use("/auth", authRouter); // public
apiRouter.use(requireAuth); // bouncer
apiRouter.use("/tickets", ticketsRouter);


export default apiRouter;
