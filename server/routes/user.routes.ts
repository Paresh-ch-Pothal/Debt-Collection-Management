import express from "express";
import jwt from 'jsonwebtoken'
import bycrypt from 'bcryptjs'
import userController from '../controller/user.controller'

const router = express.Router();


// Signup Routes
router.post('/signup',userController.userSignup)
router.post('/login',userController.userLogin)

export default router;