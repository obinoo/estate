import {Request, Response, NextFunction} from "express";
import {signUpValidate, loginValidate} from "../validator/authvalidator";
import prisma from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const signUp = async(req: Request, res: Response, next: NextFunction):Promise<any>=>{

   try{
  
    const {error} = signUpValidate.validate(req.body);

    if(error) return res.status(400).json({error: error.details[0].message});

    const {name, email, password, phone, house_no} = req.body;
    
     const exisitingUser = await prisma.user.findUnique({
         where:{
             email: email
         }
     })

     if(exisitingUser) return res.status(400).json({error: "User already exists"});

     const hashedPassword = await bcrypt.hash(password, 10);

       const user = await prisma.user.create({
          data:{
                name,
                email,
                password: hashedPassword,
                phone, 
                house_no,
          }
       })
       res.status(201).json({message: "User created successfully", user});

   }catch(error){
    console.log(error)
    res.status(500).json({ error: 'Error occurred during login' });
   }
}


export const login = async (req:Request, res:Response): Promise<any>=>{
    
    try{

        const {error} = loginValidate.validate(req.body);
        if(error) return res.status(400).json({error: error.details[0].message});

        const {email, password} = req.body;

        const exisitingUser = await prisma.user.findUnique({
            where:{
                email
            }
        })
        if(!exisitingUser) return res.status(400).json({error:'User does not exist'});
        const validPassword = await bcrypt.compare(password, exisitingUser.password!)

        if(!validPassword) return res.status(401).json({error: 'Invalid password'});

        const token = jwt.sign({email: exisitingUser.email, id: exisitingUser.id}, process.env.JWT_SECRET as string, {expiresIn: '1h'}); 

        res.status(200).json({message: 'Login successful', user: exisitingUser, token});


    } catch(error){
        console.log(error);
        res.status(500).json({ error: 'Error occurred during login' });
    }
}