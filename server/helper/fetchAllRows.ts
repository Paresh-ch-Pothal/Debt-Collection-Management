import { pool } from "../connectSQL";

export const fetchAllRows = async (userId: string) => {
  const rows = await pool.query(
    `
    SELECT 
      c.*,
      COALESCE(json_agg(m.*) FILTER (WHERE m.id IS NOT NULL), '[]') AS messages
    FROM csv_records c
    LEFT JOIN messages m ON c.id = m.debtor_id
    WHERE c.user_id = $1
    GROUP BY c.id
    ORDER BY c.createdAt DESC
    `,
    [userId]
  );
  return rows.rows;
};
