import { Router } from "express";
import healthRouter from "./health.js";
import ticketsRouter from "./tickets.js";
import authRouter from "./auth.js";

const apiRouter = Router();

apiRouter.use("/", healthRouter);
apiRouter.use("/tickets", ticketsRouter);
apiRouter.use("/auth", authRouter);


export default apiRouter;
