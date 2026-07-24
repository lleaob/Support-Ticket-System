import { Router } from "express";
import healthRouter from "./health.js";
import readyRouter from "./ready.js";
import ticketsRouter from "./tickets.js";

const apiRouter = Router();

apiRouter.use("/", healthRouter);
apiRouter.use("/ready", readyRouter);
apiRouter.use("/tickets", ticketsRouter);

export default apiRouter;
