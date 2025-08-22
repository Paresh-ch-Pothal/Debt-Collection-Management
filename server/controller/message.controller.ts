import express, { Request, Response } from 'express'
import { pool } from '../connectSQL';
import twilio from 'twilio'


const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER } = process.env;
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const MessagingResponse = require("twilio").twiml.MessagingResponse;


const sendMessage = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.user?._id;
        if (!userId) {
            return res.status(400).json({ message: "You are not authorized is required", success: false });
        }
        const { recordId, message } = req.body;
        if (!recordId || !message) {
            return res.status(400).json({ message: "Record ID and message are required", success: false });
        }
        const recordRes = await pool.query(
            `SELECT * FROM csv_records WHERE id = $1 and user_id = $2`, [recordId, userId]
        )
        if (recordRes.rowCount === 0) {
            return res.status(404).json({ message: "Record not found", success: false });
        }
        const record = recordRes.rows[0];
        // console.log(record)

        const msg = await client.messages.create({
            from: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:+91${record.phoneno}`,
            body: message
        });

        await pool.query(
            `UPDATE csv_records SET send_status = $1 WHERE id = $2`,
            [true, record.id]
        );

        return res.status(200).json({ message: "Message sent successfully", success: true, data: msg });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

const getReply = async (req: Request, res: Response) => {
    try {

        // Twilio sends 'From' and 'Body' in webhook
        const fromRaw = req.body.From || req.body.from;
        const messageBody = req.body.Body || req.body.body;

        if (!fromRaw || !messageBody) {
            return res.status(400).json({ message: "Invalid request", success: false });
        }

        // Normalize phone number
        const normalizeNumber = (num: string) => {
            if (num.startsWith("whatsapp:+91")) return num.slice(12); // remove 'whatsapp:+91'
            if (num.startsWith("+91")) return num.slice(3);
            if (num.startsWith("0")) return num.slice(1);
            return num;
        };

        const fromNumber = normalizeNumber(fromRaw);


        // console.log("Incoming SMS from:", fromNumber);
        // console.log("Message body:", messageBody);

        // Check the database for the latest record for this number
        const rec = await pool.query(
            `SELECT * FROM csv_records WHERE phoneNo = $1 ORDER BY id DESC LIMIT 1`,
            [fromNumber]
        );
        // console.log(rec)
        // console.log(fromNumber)

        if (rec.rowCount && rec.rowCount > 0) {
            const recordId = rec.rows[0].id;
            await pool.query(
                "UPDATE csv_records SET response = $1 WHERE id = $2",
                [messageBody, recordId]
            );
            // console.log(`Record ${recordId} updated successfully with reply: ${messageBody}`);

            // Send auto-reply to sender
            const twiml = new twilio.twiml.MessagingResponse();
            twiml.message("Thanks! Your response has been recorded.");

            res.type("text/xml").send(twiml.toString());
        } else {
            // console.log("No record found for this number:", fromNumber);
            res.type("text/xml").send(new twilio.twiml.MessagingResponse().message(
                "Sorry, no record found for your number."
            ).toString());
        }

    } catch (error) {
        console.log("Error in getReply:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};


export default { sendMessage, getReply }
