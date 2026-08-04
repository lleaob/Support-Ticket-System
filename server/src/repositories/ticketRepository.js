import { query } from "../db.js";

const SELECT_TICKET = `
	SELECT
		t.id, t.subject, t.status, t.priority, t.description,
		t.created_at, t.updated_at,
		r.email AS requester,
		r.name AS requester_name,
		a.email AS assignee,
		a.name AS assignee_name
	FROM tickets t
	JOIN users r ON r.id = t.requester_id
	LEFT JOIN users a ON a.id = t.assignee_id
`

// visibleTo
function visibleTo(placeholder) {
    return `(t.requester_id = ${placeholder} OR t.assignee_id = ${placeholder})`;
}

// findAllVisibleTo
export async function findAllVisibleTo(userId) {
    const { rows } = await query(
        `${SELECT_TICKET}
        WHERE ${visibleTo("$1")}
        ORDER BY
            CASE t.priority WHEN 'high' THEN 0 WHEN 'medium' THEN 1 ELSE 2 END,
            t.created_at`,
        [userId]
    );
    return rows;
}

// findByIdVisibleTo
// Returns null both when the ticket doesn't exist and when it exists but
// isn't visible to userId — these two cases are indistinguishable by design,
// so callers can't leak whether a given ticket id exists at all.
export async function findByIdVisibleTo(id, userId) {
    const { rows } = await query(
        `${SELECT_TICKET} WHERE t.id = $1 AND ${visibleTo("$2")}`,
        [id, userId]
    );
    return rows[0] || null;
}

// countByStatusVisibleTo
export async function countByStatusVisibleTo(status, userId) {
    const { rows } = await query(
        `SELECT COUNT(*) FROM tickets t WHERE t.status = $1 AND ${visibleTo("$2")}`,
        [status, userId]
    );
    return Number(rows[0].count);
}

// countAll
// Deliberately unscoped: only consumer is the /api/ready health check
// (via ticketService.countTickets), which needs a total across all
// tickets, not one user's visible subset. Not an oversight — do not
// add a visibleTo() filter here.
export async function countAll() {
    const {rows} = await query(
        `SELECT COUNT(*) FROM tickets`
    );
    return Number(rows[0].count);
}