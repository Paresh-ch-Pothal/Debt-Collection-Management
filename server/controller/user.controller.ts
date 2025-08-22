import express, { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import bycrypt from 'bcryptjs'
import { pool } from "../connectSQL";



//user signup functions
const userSignup = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill all the fields", success: false });
        }
        // check if user already exists
        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "User already exists", success: false });
        }
        //hash the password
        const hashedPassword = await bycrypt.hash(password, 10);
        const user = await pool.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *", [name, email, hashedPassword]);

        const payload = {
            user: {
                _id: user.rows[0].id,
                name: user.rows[0].name,
            },
        };
        const token = jwt.sign(payload,process.env.JWT_SECRET!)
        return res.status(201).json({"user": user.rows[0],success: true,token,message: "User Created Successfully"})
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}


// user login functions
const userLogin = async (req: Request, res: Response) => {
    try {
        const {email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all the fields", success: false });
        }
        // check if user already exists
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length == 0) {
            return res.status(400).json({ message: "Invalid Credentials", success: false });
        }
        const isMatch = await bycrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials", success: false });
        }
        
        const payload = {
            user: {
                _id: user.rows[0].id,
                name: user.rows[0].name,
            },
        };
        const token = jwt.sign(payload,process.env.JWT_SECRET!)
        return res.status(201).json({"user": user.rows[0],success: true,token,message : "Login SuccessFul"})
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}


export default {userSignup,userLogin};