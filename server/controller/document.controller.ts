import express, { Request, Response } from 'express'
import { pool } from '../connectSQL';


const uploadFile = async (req: Request, res: Response) => {
    try {
        const rows = req.body.rows as Array<any>;
        if (!rows || !Array.isArray(rows)) {
            return res.status(400).json({ message: "rows must be an array", success: false });
        }
        for (const row of rows) {
            await pool.query(
                `INSERT INTO csv_records (name, phoneNo, email, debt, sentiment, response, user_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7) `,
                [
                    row.name,
                    row.phoneNo,
                    row.email,
                    row.debt,
                    row.sentiment || "Pending",
                    row.response || "Pending",
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

const getAllRows = async(req:Request,res:Response) => {
    try {
        const userId = req.user?.user?._id;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required", success: false });
        }
        const rows = await pool.query(
            `SELECT * FROM CSV_RECORDS WHERE user_id = $1`,[userId]
        )
        if (rows.rowCount === 0) {
            return res.status(404).json({ message: "No records found", success: false });
        }
        return res.status(200).json({ message: "Records fetched successfully", success: true, data: rows.rows });
    } catch (error) {
        console.error("Error occured while fetching data", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export default {uploadFile , getAllRows}