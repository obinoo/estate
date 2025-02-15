import dotenv from 'dotenv';
dotenv
import express, {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
    email: String;
    id:   String
    
  }

const SECRET = process.env.JWT_SECRET 

if (!SECRET) {
    throw new Error('JWT_SECRET is not defined');
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try{
        const token = req.header('Authorization')?.replace('Bearer ', '');

    if(!token) return res.status(401).json({error: 'Unauthorized'})

         const decoded = jwt.verify(token, SECRET) as JwtPayload;
         req.user = {email: decoded.email, id: decoded.id};

         next();

    }catch(error){
        console.error('Auth error:', error);
        res.status(401).json({error: 'Unauthorized'})
    }
}

export default authenticate;