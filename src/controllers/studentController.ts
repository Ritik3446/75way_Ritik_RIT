import { User } from '../models/userSchema';
import { Question } from '../models/examSchema';
import {Answer } from '../models/answerSchema';
import jwt from 'jsonwebtoken';
const express = require('express');
const router = express.Router();
import dotenv from 'dotenv';
dotenv.config();


export const register = async (req: any, res: any) => {
    // Check if this user already exisits
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send('That user already exisits!');
    } else {
        const role = "Student";
        // Insert the new user if they do not exist yet
        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role
        });
        await user.save();
        res.send(user);
    }
};

export const login = async (req: any, res: any) => {
    // Check if this user exisits or not
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send('User not found!');
    } else {
        const jwtSecretKey = 'secretkeyrick';
        const data = {
            userId: user._id,
            role: user.role
        }
        const token = jwt.sign(data, jwtSecretKey);
        res.send("token:"+token);
    }
};

export const getexam = async (req:any, res:any) => {
    try {
        const questions = await Question.find({},{ _id: true, description: true, alternatives:true});
        return res.status(200).json(questions)
    } catch (error) {
        return res.status(500).json({"error":error})
    }
};

export const startexam = async (req:any, res:any) => {
    try {
        
        const answer = new Answer({
            id : req.body.id,
            answer: req.body.answer
        });
        await answer.save();
        res.send(answer);
    } catch (error) {
        return res.status(500).json({"error":error})
    }
};

export default router;