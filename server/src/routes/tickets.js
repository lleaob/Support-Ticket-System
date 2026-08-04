import { Router } from "express";
import {
  listTicketsFor,
  getTicketByIdFor,
  countTickets,
  countOpenTicketsFor,
} from "../services/ticketService.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    res.json(await listTicketsFor(req.user.id));
  } catch (err) {
    next(err);
  }
});

router.get("/count", async (req, res, next) => {
  try {
    res.json({ count: await countTickets() });
  } catch (err) {
    next(err);
  }
});

router.get("/open", async (req, res, next) => {
  try {
    res.json({ open: await countOpenTicketsFor(req.user.id) });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    res.json(await getTicketByIdFor(req.params.id, req.user.id));
  } catch (err) {
    next(err);
  }
});

export default router;
