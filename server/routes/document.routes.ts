import express from "express";
import documentController from '../controller/document.controller'
import fetchuser from "../middleware/authmiddleware";

const router = express.Router();



router.post('/upload_file', fetchuser , documentController.uploadFile)
router.get('/get_records', fetchuser , documentController.getAllRows)

export default router;