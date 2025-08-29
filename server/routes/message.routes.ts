import express from "express";
import messageController from '../controller/message.controller'
import fetchuser from "../middleware/authmiddleware";

const router = express.Router();



router.post('/send_message', fetchuser , messageController.sendMessage)
router.post('/get_reply', messageController.getReplyandWebhook)
router.get('/get_report_details/:id', fetchuser, messageController.getCsvRecordDetails)

export default router;