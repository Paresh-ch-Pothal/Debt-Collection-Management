import express, { Request, Response } from 'express'
import { pool } from '../connectSQL';
import axios from "axios";
import { fetchAllRows } from '../helper/fetchAllRows';


const uploadFile = async (req: Request, res: Response) => {
    try {
        const rows = req.body.rows as Array<any>;
        if (!rows || !Array.isArray(rows)) {
            return res.status(400).json({ message: "rows must be an array", success: false });
        }
        for (const row of rows) {
            await pool.query(
                `INSERT INTO csv_records (name, phoneNo, email, debt, user_id)
         VALUES ($1, $2, $3, $4, $5) `,
                [
                    row.name,
                    row.phoneNo,
                    row.email,
                    row.debt,
                    req.user?.user?._id,
                ]
            )
        }
        return res.status(200).json({ message: "File uploaded successfully", success: true });
    } catch (error) {
        console.error("Error uploading file:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// const getAllRows = async (req: Request, res: Response) => {
//     try {
//         const userId = req.user?.user?._id;
//         if (!userId) {
//             return res.status(400).json({ message: "User ID is required", success: false });
//         }
//         const rows = await pool.query(
//             `SELECT * FROM CSV_RECORDS WHERE user_id = $1`, [userId]
//         )
//         if (rows.rowCount === 0) {
//             return res.status(404).json({ message: "No records found", success: false });
//         }
//         return res.status(200).json({ message: "Records fetched successfully", success: true, data: rows.rows });
//     } catch (error) {
//         console.error("Error occured while fetching data", error);
//         return res.status(500).json({ message: "Internal server error", success: false });
//     }
// }

// const getAllRows = async (req: Request, res: Response) => {
//     try {
//         const userId = req.user?.user?._id;
//         if (!userId) {
//             return res.status(400).json({ message: "User ID is required", success: false });
//         }

//         const rows = await pool.query(
//             `
//       SELECT 
//         c.*,
//         COALESCE(json_agg(m.sentiment) FILTER (WHERE m.id IS NOT NULL), '[]') AS sentiments,
//         COALESCE(json_agg(m.message) FILTER (WHERE m.id IS NOT NULL AND m.direction = 'reply'), '[]') AS responses
//       FROM csv_records c
//       LEFT JOIN messages m ON c.id = m.debtor_id
//       WHERE c.user_id = $1
//       GROUP BY c.id
//       ORDER BY c.createdAt DESC
//       `,
//             [userId]
//         );

//         if (rows.rowCount === 0) {
//             return res.status(404).json({ message: "No records found", success: false });
//         }

//         return res.status(200).json({
//             message: "Records fetched successfully",
//             success: true,
//             data: rows.rows,
//         });
//     } catch (error) {
//         console.error("Error occurred while fetching data", error);
//         return res.status(500).json({ message: "Internal server error", success: false });
//     }
// };


const getSentiment = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.user?._id;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required", success: false });
        }

        const records = await fetchAllRows(userId);

        if (records.length === 0) {
            return res.status(404).json({ message: "No records found", success: false });
        }

        for (const record of records) {
            for (const msg of record.messages) {
                if (!msg.message || msg.message.trim() === "") continue;
                if (msg.sentiment) continue; // already has sentiment
                if(msg.direction == 'sent') continue;
                const response = await axios.post(`${process.env.SENTIMENT_API_URL}/predict`, {
                    text: msg.message
                });

                const sentiment = response.data.sentiment;

                // Update sentiment in DB
                await pool.query(
                    `UPDATE messages SET sentiment = $1 WHERE id = $2`,
                    [sentiment, msg.id]
                );

                msg.sentiment = sentiment;
            }
        }

        return res.status(200).json({
            message: "Sentiment updated successfully",
            success: true,
            data: records,
        });

    } catch (error) {
        console.error("Error occurred while fetching/updating sentiments", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};


export default { uploadFile, getSentiment }