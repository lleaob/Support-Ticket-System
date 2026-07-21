import { Router } from "express";
import { tickets } from "../data/tickets.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(tickets);
});

router.get("/:id", (req, res) => {
  const ticket = tickets.find((t) => t.id === Number(req.params.id));
  if (!ticket) {
    return res.status(404).json({ error: "Ticket not found" });
  }
  res.json(ticket);
});

export default router;
