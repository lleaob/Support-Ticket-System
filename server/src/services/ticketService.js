import * as ticketRepository from "../repositories/ticketRepository.js";
import AppError from "../errors/AppError.js";

export async function listTicketsFor(userId) {
  return ticketRepository.findAllVisibleTo(userId);
}

export async function getTicketByIdFor(id, userId) {
  const ticket = await ticketRepository.findByIdVisibleTo(id, userId);
  if (!ticket) {
    // 404 here covers both "no such ticket" and "exists but not visible to
    // userId" — never 403, so a caller can't tell the two cases apart and
    // enumerate ticket ids that exist but belong to someone else.
    throw AppError.notFound(`Ticket ${id} not found`);
  }
  return ticket;
}

export async function countOpenTicketsFor(userId) {
  return ticketRepository.countByStatusVisibleTo("open", userId);
}

// Unscoped: exists only for the /api/ready health probe (a global tickets
// total), never for answering a specific user's own question.
export async function countTickets() {
  return ticketRepository.countAll();
}
