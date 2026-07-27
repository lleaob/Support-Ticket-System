import { Router } from "express";
import { listTickets, getTicketById, countOpenTickets } from "../services/ticketService.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(listTickets());
});

router.get("/count", (req, res) => {
  res.json({ open: countOpenTickets() });
});

router.get("/:id", (req, res) => {
  try {
    res.json(getTicketById(req.params.id));
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

export default router;
