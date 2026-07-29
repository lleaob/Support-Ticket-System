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

// findAll
export async function findAll() {
    const { rows } = await query(   
        `${SELECT_TICKET}
        ORDER BY
            CASE t.priority WHEN 'high' THEN 0 WHEN 'medium' THEN 1 ELSE 2 END,
            t.created_at`
    );
    return rows;
}

// findById
export async function findById(ticketId) {
    const { rows } = await query(
        `${SELECT_TICKET} WHERE t.id = $1`,
        [ticketId]
    );
    return rows[0]; // `return rows` would return an empty array like [] if NOT found. error handling !tickets would never change value.
}

// countByStatus
export async function countByStatus(status) {
    const { rows } = await query(
        `SELECT COUNT(*) FROM tickets t WHERE t.status = $1`, 
        [status]
    );
    return Number(rows[0].count); // rows[0] returns an object ({ key: value }) || { count: '1'} where '1' is a string. > .count extracts that value.
}

// countAll
export async function countAll() {
    const {rows} = await query(
        `SELECT COUNT(*) FROM tickets`
    );
    return Number(rows[0].count);
}