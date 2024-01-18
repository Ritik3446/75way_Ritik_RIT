import { User } from '../models/userSchema';
import { Exam } from '../models/examSchema';
import {Answer } from '../models/answerSchema'
import { submitSchema } from '../models/answerSheet';
import jwt from 'jsonwebtoken';
import bcrypt, { hash } from 'bcryptjs';
import express from 'express';
const router = express.Router();
import dotenv from 'dotenv';
dotenv.config();

export const register = async (req: any, res: any) => {
    // Check if this user already exisits
    let student = await User.findOne({ email: req.body.email });
    if (student) {
        return res.status(400).send('That user already exisits!');
    } else {
        const hashpassword = bcrypt.hashSync(req.body.password, 10);
        const role = "Student";
        // Insert the new user if they do not exist yet
        student = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashpassword,
            role
        });
        await student.save();
        res.status(200).json({
            "examiner": student
        });
    }
};

export const login = async (req: any, res: any) => {
    // Check if this user exisits or not
    const student = await User.findOne({ email: req.body.email });
    if (student) {
        const match = await bcrypt.compare(req.body.password, student.password)
        if (match) {
            const jwtSecretKey = 'secretkeyrick';
            const data = {
                userId: student._id,
                role: student.role,
            }
            const token = jwt.sign(data, jwtSecretKey, { expiresIn: '1h' });
            res.status(200).json({
                "access": token
            });
        } else {
            res.status(401).json("Wrong password");
        }

    } else {
        return res.status(400).send('User not found!');
    }
};

export const getexam = async (req: any, res: any) => {
    try {
        const exam = await Exam.findById(req.body._id);
        return res.status(200).json({
            "exam": exam
        })
    } catch (error) {
        return res.status(500).json({ "error": error })
    }
};

export const startexam = async (req: any, res: any) => {

    try {
        const answer = new submitSchema({
            Exam_id: req.body.Exam_id,
            student_id: res.locals.user.userId,
            answerset: req.body.answerset
        });
        await answer.save();
        res.send(answer);
    } catch (error) {
        return res.status(500).json({ "error": error })
    }
};

export const getallanswers = async (req: any, res: any) => {
    try {
        const answers = await Answer.find({ student_id: res.locals.user.userId });
        return res.status(200).json(answers)
    } catch (error) {
        return res.status(500).json({ "error": error })
    }
};

export default router;