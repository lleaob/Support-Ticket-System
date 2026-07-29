import * as ticketRepository from "../repository/ticketRepository.js";
import AppError from "../errors/AppError.js";

export async function listTickets() {
  return ticketRepository.findAll();
}

export async function getTicketById(id) {
  const ticket = await ticketRepository.findById(id);
  if (!ticket) {
    throw AppError.notFound(`Ticket ${id} not found`);
  }
  return ticket;
}

export async function countTickets() {
  return ticketRepository.countAll();
}

export async function countOpenTickets() {
  return ticketRepository.countByStatus("open");
}
