import express from "express";
import cors from "cors";
import ticketsRouter from "./routes/tickets.js";
import config from "./config/index.js";

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/tickets", ticketsRouter);

app.listen(config.port, () => {
  console.log(`Support-desk API listening on http://localhost:${config.port}`);
});
