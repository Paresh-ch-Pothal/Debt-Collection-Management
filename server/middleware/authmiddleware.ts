import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken'


interface Userpayload {
    user: {
        _id: string
        name: string
    }
}

declare global {
    namespace Express {
        interface Request {
            user?: Userpayload;
        }
    }
}

const fetchuser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ success: false, message: "Authorization header is missing" });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "Token is Missing" })
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET!) as Userpayload;
        req.user = decode;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false, message: "Invalid Token" });
    }
}


export default fetchuser;