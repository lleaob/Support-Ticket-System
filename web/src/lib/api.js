import { API_BASE } from '../config.js'

export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function messageFrom(body, status) {
  if (typeof body?.error === 'string') {
    return body.error
  }
  if (body?.error?.message) {
    return body.error.message
  }
  return `Request failed (${status})`
}

async function apiFetch(path, { token, method = 'GET', body } = {}) {
  const headers = {
    ...(body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const text = await res.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      throw new ApiError(res.status, 'Received an invalid response from the server')
    }
  }

  if (!res.ok) {
    throw new ApiError(res.status, messageFrom(data, res.status))
  }

  return data
}

export async function login(email, password) {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  })
}

export async function register(email, name, password) {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: { email, name, password },
  })
}

export async function fetchCurrentUser(token) {
  return apiFetch('/api/auth/me', { token })
}

export async function fetchTickets(token) {
  return apiFetch('/api/tickets', { token })
}

export async function fetchTicket(id, token) {
  return apiFetch(`/api/tickets/${id}`, { token })
}
