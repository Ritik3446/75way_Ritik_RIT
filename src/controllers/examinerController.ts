import { User } from '../models/userSchema';
import { Question }  from '../models/examSchema';
const express = require('express');
const router = express.Router();
import jwt from 'jsonwebtoken';



export const register = async (req:any, res:any) => {
    // Check if this user already exisits
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send('That user already exisits!');
    } else {

        const role = "Examiner"
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

export const login = async (req:any, res:any) => {
    const user = await User.findOne({ email: req.body.email });
    // Check if this user exisits or not
    if (!user) {
        return res.status(400).send('User not found!');
    } else {
        const jwtSecretKey = 'secretkeyrick';
        const data = {
            userId: user._id,
            role: user.role
        }
        const token = jwt.sign(data, jwtSecretKey);
        res.send(token);
    }
};

export const createexam = async (req:any, res:any) => {
        try {
            const { description } = req.body
            const { alternatives } = req.body
            const {correct_option } = req.body
    
            const question = await Question.create({
                description,
                alternatives,
                correct_option
            })
    
            return res.status(201).json(question)
        } catch (error) {
            return res.status(500).json({"error":error})
        }
};

export const getexam = async (req:any, res:any) => {
    try {
        const questions = await Question.find()
        return res.status(200).json(questions)
    } catch (error) {
        return res.status(500).json({"error":error})
    }
};

export default router;