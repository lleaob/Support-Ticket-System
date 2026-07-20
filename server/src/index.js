import express from "express";
import cors from "cors";
import ticketsRouter from "./routes/tickets.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/tickets", ticketsRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Support-desk API listening on http://localhost:${PORT}`);
});
