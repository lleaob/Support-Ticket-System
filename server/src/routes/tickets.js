import { Router } from "express";
import {
  listTickets,
  getTicketById,
  countTickets,
  countOpenTickets,
} from "../services/ticketService.js";
import AppError from "../errors/AppError.js";

const router = Router();

function toAppError(err) {
  return err instanceof AppError ? err : new AppError(err.message);
}

router.get("/", async (req, res, next) => {
  try {
    res.json(await listTickets());
  } catch (err) {
    next(toAppError(err));
  }
});

router.get("/count", async (req, res, next) => {
  try {
    res.json({ count: await countTickets() });
  } catch (err) {
    next(toAppError(err));
  }
});

router.get("/open", async (req, res, next) => {
  try {
    res.json({ open: await countOpenTickets() });
  } catch (err) {
    next(toAppError(err));
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    res.json(await getTicketById(req.params.id));
  } catch (err) {
    next(toAppError(err));
  }
});

export default router;
