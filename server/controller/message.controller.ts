// import express, { Request, Response } from "express";
// import { pool } from "../connectSQL";
// import axios from "axios";
// import { generateDebtMessage } from "../function/generate_message";

// const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
// const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

// // Webhook for Telegram updates
// const getReplyandWebhook = async (req: Request, res: Response) => {
//     try {
//         const update = req.body;
//         if (!update.message) return res.sendStatus(200);

//         const msg = update.message;
//         const chatId = msg.chat.id;
//         const text = msg.text?.trim() || "";

//         // console.log("Chat ID:", chatId);
//         // console.log("Message:", text);

//         if (text === "/start") {
//             // Ask the user to enter their email
//             await axios.post(`${TELEGRAM_API}/sendMessage`, {
//                 chat_id: chatId,
//                 text: "✅ Welcome! Please reply with your email address so we can link your records.",
//             });
//         } else {
//             // Check if this chatId is already linked to a csv_record
//             const recordCheck = await pool.query(
//                 `SELECT id FROM csv_records WHERE chat_id = $1 ORDER BY createdAt DESC LIMIT 1`,
//                 [chatId]
//             );

//             if (recordCheck.rowCount === 0) {
//                 // No record yet → treat as email
//                 const email = text.toLowerCase();
//                 const updateRes = await pool.query(
//                     `UPDATE csv_records SET chat_id = $1 WHERE email = $2`,
//                     [chatId, email]
//                 );

//                 if (updateRes.rowCount && updateRes.rowCount > 0) {
//                     await axios.post(`${TELEGRAM_API}/sendMessage`, {
//                         chat_id: chatId,
//                         text: "✅ Your email has been linked successfully! You can now receive messages.",
//                     });
//                 } else {
//                     await axios.post(`${TELEGRAM_API}/sendMessage`, {
//                         chat_id: chatId,
//                         text: "⚠️ No record found with this email. Please make sure you typed it correctly.",
//                     });
//                 }
//             } else {
//                 // There is a record → treat this message as a reply
//                 const recordId = recordCheck.rows[0].id;

//                 await pool.query(
//                     `UPDATE csv_records SET response = $1 WHERE id = $2`,
//                     [text, recordId]
//                 );

//                 // Optional: send acknowledgment
//                 await axios.post(`${TELEGRAM_API}/sendMessage`, {
//                     chat_id: chatId,
//                     text: "✅ Thanks! Your response has been recorded.",
//                 });
//             }
//         }

//         res.sendStatus(200);
//     } catch (err) {
//         console.error("Telegram webhook error:", err);
//         res.sendStatus(500);
//     }
// };


// // Send message to csv_record via Telegram
// const sendMessage = async (req: Request, res: Response) => {
//     try {
//         const userId = req.user?.user?._id;
//         if (!userId) {
//             return res.status(400).json({ message: "You are not authorized", success: false });
//         }

//         const { recordId } = req.body;
//         if (!recordId) {
//             return res.status(400).json({ message: "Record ID and message are required", success: false });
//         }

//         // Get csv_record



//         const recordRes = await pool.query(
//             `SELECT * FROM csv_records WHERE id = $1 AND user_id = $2`,
//             [recordId, userId]
//         );



//         if (recordRes.rowCount === 0) {
//             return res.status(404).json({ message: "Record not found", success: false });
//         }

//         const record = recordRes.rows[0];
//         if (!record.chat_id) {
//             return res.status(400).json({ message: "User has not linked their Telegram account", success: false });
//         }

//         const message = await generateDebtMessage(record.name , record.debt);

//         // Send message via Telegram
//         const tgRes = await axios.post(`${TELEGRAM_API}/sendMessage`, {
//             chat_id: record.chat_id,
//             text: message,
//         });

//         // Update send_status
//         await pool.query(
//             `UPDATE csv_records SET send_status = TRUE WHERE id = $1`,
//             [record.id]
//         );

//         res.status(200).json({ message: "Message sent successfully", success: true, data: tgRes.data });
//     } catch (err) {
//         console.error("Send message error:", err);
//         res.status(500).json({ message: "Internal server error", success: false });
//     }
// };

// export default { getReplyandWebhook, sendMessage };



import express, { Request, Response } from "express";
import { pool } from "../connectSQL";
import axios from "axios";
import { generateDebtMessage } from "../function/generate_message";

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

/**
 * Webhook for Telegram replies
 */
const getReplyandWebhook = async (req: Request, res: Response) => {
    try {
        const update = req.body;
        if (!update.message) return res.sendStatus(200);

        const msg = update.message;
        const chatId = msg.chat.id;
        const text = msg.text?.trim() || "";

        if (text === "/start") {
            // Ask the user to enter their email
            await axios.post(`${TELEGRAM_API}/sendMessage`, {
                chat_id: chatId,
                text: "✅ Welcome! Please reply with your email address so we can link your records.",
            });
        } else {
            // Check if this chatId is already linked to a csv_record
            const recordCheck = await pool.query(
                `SELECT id FROM csv_records WHERE chat_id = $1 ORDER BY createdAt DESC LIMIT 1`,
                [chatId]
            );

            if (recordCheck.rowCount === 0) {
                // No record yet → treat as email
                const email = text.toLowerCase();
                const updateRes = await pool.query(
                    `UPDATE csv_records SET chat_id = $1 WHERE email = $2`,
                    [chatId, email]
                );

                if (updateRes.rowCount && updateRes.rowCount > 0) {
                    await axios.post(`${TELEGRAM_API}/sendMessage`, {
                        chat_id: chatId,
                        text: "✅ Your email has been linked successfully! You can now receive messages.",
                    });
                } else {
                    await axios.post(`${TELEGRAM_API}/sendMessage`, {
                        chat_id: chatId,
                        text: "⚠️ No record found with this email. Please make sure you typed it correctly.",
                    });
                }
            } else {
                // Record exists → treat this message as a reply
                const recordId = recordCheck.rows[0].id;

                // Find the last sent message for this debtor
                const lastMessage = await pool.query(
                    `SELECT id FROM messages 
                     WHERE debtor_id = $1 AND direction = 'sent' 
                     ORDER BY createdAt DESC LIMIT 1`,
                    [recordId]
                );

                let replyToId = null;
                if (lastMessage.rowCount && lastMessage.rowCount > 0) {
                    replyToId = lastMessage.rows[0].id;
                }

                console.log("Replying to message ID:", replyToId);

                // Store reply in messages table, linking it to the last sent message
                await pool.query(
                    `INSERT INTO messages (debtor_id, message, direction, reply_to_message_id, createdAt) 
                     VALUES ($1, $2, 'reply', $3, NOW())`,
                    [recordId, text, replyToId]
                );

                // Update total replies count
                await pool.query(
                    `UPDATE csv_records SET total_replies = total_replies + 1 WHERE id = $1`,
                    [recordId]
                );

                // Optional: send acknowledgment
                await axios.post(`${TELEGRAM_API}/sendMessage`, {
                    chat_id: chatId,
                    text: "✅ Thanks! Your response has been recorded.",
                });
            }
        }

        res.sendStatus(200);
    } catch (err) {
        console.error("Telegram webhook error:", err);
        res.sendStatus(500);
    }
};

/**
 * Send message to debtor via Telegram
 */
const sendMessage = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.user?._id;
        if (!userId) {
            return res.status(400).json({ message: "You are not authorized", success: false });
        }

        const { recordId } = req.body;
        if (!recordId) {
            return res.status(400).json({ message: "Record ID is required", success: false });
        }

        // Get csv_record
        const recordRes = await pool.query(
            `SELECT * FROM csv_records WHERE id = $1 AND user_id = $2`,
            [recordId, userId]
        );

        if (recordRes.rowCount === 0) {
            return res.status(404).json({ message: "Record not found", success: false });
        }

        const record = recordRes.rows[0];
        if (!record.chat_id) {
            return res.status(400).json({ message: "User has not linked their Telegram account", success: false });
        }



        // Generate debt reminder message
        const message = await generateDebtMessage(record.name, record.debt);

        // Send message via Telegram
        const tgRes = await axios.post(`${TELEGRAM_API}/sendMessage`, {
            chat_id: record.chat_id,
            text: message,
        });

        // Store in messages table as a sent message
        await pool.query(
            `INSERT INTO messages (debtor_id, message, direction, createdAt) 
       VALUES ($1, $2, 'sent', NOW())`,
            [record.id, message]
        );

        await pool.query(
            `UPDATE csv_records SET total_messages_sent = total_messages_sent + 1 WHERE id = $1`, [record.id]
        )

        res.status(200).json({ message: "Message sent successfully", success: true, data: tgRes.data });
    } catch (err) {
        console.error("Send message error:", err);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};


// const getCsvRecordDetails = async (req: Request, res: Response) => {
//     try {
//         const userId = req.user?.user?._id;
//         const { id: recordId } = req.params;

//         if (!userId) {
//             return res.status(400).json({ message: "User ID is required", success: false });
//         }

//         if (!recordId) {
//             return res.status(400).json({ message: "Record ID is required", success: false });
//         }

//         // Fetch the CSV record
//         const recordRes = await pool.query(
//             `SELECT * FROM csv_records WHERE id = $1 AND user_id = $2`,
//             [recordId, userId]
//         );

//         if (recordRes.rowCount === 0) {
//             return res.status(404).json({ message: "Record not found", success: false });
//         }

//         const record = recordRes.rows[0];

//         // Fetch replies for this record
//         const repliesRes = await pool.query(
//             `SELECT id, message, sentiment, reply_to_message_id, createdAt
//        FROM messages
//        WHERE debtor_id = $1 AND direction = 'reply'
//        ORDER BY createdAt ASC`,
//             [record.id]
//         );
//         const replies = repliesRes.rows;

//         // Fetch sent messages
//         const sentMessagesRes = await pool.query(
//             `SELECT id, createdAt FROM messages WHERE debtor_id = $1 AND direction = 'sent' ORDER BY createdAt ASC`,
//             [record.id]
//         );
//         const sentMessages = sentMessagesRes.rows;

//         // last_reply_at
//         const lastReplyAt =
//             replies.length > 0
//                 ? new Date(Math.max(...replies.map((r) => new Date(r.createdat).getTime())))
//                 : null;

//         // avg_reply_time
//         const replyTimes: number[] = [];

//         replies.forEach((reply) => {
//             if (reply.reply_to_message_id) {
//                 const sentMsg = sentMessages.find((s) => s.id === reply.reply_to_message_id);
//                 if (sentMsg) {
//                     const diff = new Date(reply.createdat).getTime() - new Date(sentMsg.createdat).getTime();
//                     if (diff >= 0) replyTimes.push(diff); // only positive diffs
//                 }
//             }
//         });

//         // 2️⃣ Calculate average in milliseconds
//         const avgDiffMs =
//             replyTimes.length > 0
//                 ? replyTimes.reduce((a, b) => a + b, 0) / replyTimes.length
//                 : 0;

//         // 3️⃣ Convert milliseconds to HH:MM:SS
//         const avgReplyTime =
//             replyTimes.length > 0
//                 ? (() => {
//                     const hours = Math.floor(avgDiffMs / (1000 * 60 * 60));
//                     const minutes = Math.floor((avgDiffMs % (1000 * 60 * 60)) / (1000 * 60));
//                     const seconds = Math.floor((avgDiffMs % (1000 * 60)) / 1000);

//                     const hh = hours.toString().padStart(2, '0');
//                     const mm = minutes.toString().padStart(2, '0');
//                     const ss = seconds.toString().padStart(2, '0');

//                     return `${hh}:${mm}:${ss}`;
//                 })()
//                 : null;
            
//         console.log(avgReplyTime)

//         // reply_percentage
//         const replyPercentage =
//             record.total_messages_sent > 0
//                 ? (record.total_replies / record.total_messages_sent) * 100
//                 : 0;

//         // Update the record
//         await pool.query(
//             `UPDATE csv_records
//        SET reply_percentage = $1,
//            avg_reply_time = $2,
//            last_reply_at = $3
//        WHERE id = $4`,
//             [
//                 parseFloat(replyPercentage.toFixed(2)),
//                 avgReplyTime,
//                 lastReplyAt,
//                 record.id,
//             ]
//         );

//         // Return the record with replies
//         return res.status(200).json({
//             message: "Record report generated and updated successfully",
//             success: true,
//             data: {
//                 ...record,
//                 reply_percentage: parseFloat(replyPercentage.toFixed(2)),
//                 avg_reply_time: avgReplyTime,
//                 last_reply_at: lastReplyAt,
//                 replies: replies.map((r) => ({
//                     id: r.id,
//                     message: r.message,
//                     sentiment: r.sentiment,
//                     createdAt: r.createdat,
//                 })),
//             },
//         });
//     } catch (error) {
//         console.error("Error generating record report:", error);
//         return res.status(500).json({ message: "Internal server error", success: false });
//     }
// };


const getCsvRecordDetails = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.user?._id;
    const { id: recordId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required", success: false });
    }

    if (!recordId) {
      return res.status(400).json({ message: "Record ID is required", success: false });
    }

    // Fetch the CSV record
    const recordRes = await pool.query(
      `SELECT * FROM csv_records WHERE id = $1 AND user_id = $2`,
      [recordId, userId]
    );

    if (recordRes.rowCount === 0) {
      return res.status(404).json({ message: "Record not found", success: false });
    }

    const record = recordRes.rows[0];

    // Fetch replies for this record
    const repliesRes = await pool.query(
      `SELECT id, message, sentiment, reply_to_message_id, createdAt
       FROM messages
       WHERE debtor_id = $1 AND direction = 'reply'
       ORDER BY createdAt ASC`,
      [record.id]
    );
    const replies = repliesRes.rows;

    // Fetch sent messages
    const sentMessagesRes = await pool.query(
      `SELECT id, createdAt FROM messages WHERE debtor_id = $1 AND direction = 'sent' ORDER BY createdAt ASC`,
      [record.id]
    );
    const sentMessages = sentMessagesRes.rows;

    // Calculate last reply time
    const lastReplyAt =
      replies.length > 0
        ? new Date(Math.max(...replies.map((r) => Date.parse(r.createdat))))
        : null;

    // Calculate average reply time
    const replyTimes: number[] = [];

    replies.forEach((reply) => {
      if (reply.reply_to_message_id) {
        const sentMsg = sentMessages.find((s) => s.id === reply.reply_to_message_id);
        if (sentMsg) {
          // Parse dates as UTC to avoid wrong differences
          const diff = Date.parse(reply.createdat) - Date.parse(sentMsg.createdat);
          if (diff >= 0) replyTimes.push(diff);
        }
      }
    });

    const avgDiffMs =
      replyTimes.length > 0
        ? replyTimes.reduce((a, b) => a + b, 0) / replyTimes.length
        : 0;

    // Convert milliseconds to HH:MM:SS
    const avgReplyTime = (() => {
      const hours = Math.floor(avgDiffMs / (1000 * 60 * 60));
      const minutes = Math.floor((avgDiffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((avgDiffMs % (1000 * 60)) / 1000);

      const hh = hours.toString().padStart(2, '0');
      const mm = minutes.toString().padStart(2, '0');
      const ss = seconds.toString().padStart(2, '0');

      return `${hh}:${mm}:${ss}`;
    })();

    // Calculate reply percentage
    const replyPercentage =
      record.total_messages_sent > 0
        ? (record.total_replies / record.total_messages_sent) * 100
        : 0;

    // Update the CSV record
    await pool.query(
      `UPDATE csv_records
       SET reply_percentage = $1,
           avg_reply_time = $2,
           last_reply_at = $3
       WHERE id = $4`,
      [parseFloat(replyPercentage.toFixed(2)), avgReplyTime, lastReplyAt, record.id]
    );

    // Return record with replies
    return res.status(200).json({
      message: "Record report generated and updated successfully",
      success: true,
      data: {
        ...record,
        reply_percentage: parseFloat(replyPercentage.toFixed(2)),
        avg_reply_time: avgReplyTime,
        last_reply_at: lastReplyAt,
        replies: replies.map((r) => ({
          id: r.id,
          message: r.message,
          sentiment: r.sentiment,
          createdAt: r.createdat,
        })),
      },
    });
  } catch (error) {
    console.error("Error generating record report:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export default { getReplyandWebhook, sendMessage, getCsvRecordDetails };
