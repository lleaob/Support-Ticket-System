import express from "express";
import cors from "cors";
import ticketsRouter from "./routes/tickets.js";
import config from "./config/index.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";

export function buildApp() {
  const app = express();

  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json());

  const apiRouter = express.Router();
  apiRouter.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });
  apiRouter.use("/tickets", ticketsRouter);

  app.use("/api", apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
