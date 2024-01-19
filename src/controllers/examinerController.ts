import { User } from '../models/user';
import { Exam } from '../models/exam';
import express from 'express';
const router = express.Router();
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const register = async (req: any, res: any) => {
    // Check if this user already exisits
    let examiner = await User.findOne({ email: req.body.email });
    if (examiner) {
        return res.status(400).send('That user already exisits!');
    } else {
        const hashpassword = bcrypt.hashSync(req.body.password, 10);
        const role = "Examiner";
        // Insert the new user if they do not exist yet
        examiner = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashpassword,
            role
        });
        await examiner.save();
        res.status(200).json({
            "examiner": examiner
        });
    }
};

export const login = async (req: any, res: any) => {
    try {
        const examiner = await User.findOne({ email: req.body.email });
        // Check if this user exisits or not
        if (examiner) {
            const match = await bcrypt.compare(req.body.password, examiner.password)
            if (match) {
                const jwtSecretKey = 'secretkeyrick';
                const data = {
                    userId: examiner._id,
                    role: examiner.role
                }
                const token = jwt.sign(data, jwtSecretKey);
                res.status(200).json({
                    "access": token
                });
            }
            return res.status(401).json('Wrong password entered');


        } else {
            return res.status(400).send('User not found!');
        }

    } catch (error) {
        return res.status(500).json({ "error": error })
    }

};

export const createexam = async (req: any, res: any) => {
    try {
        const questionset = req.body.questionset;
        const totalMarks = req.body.totalMarks;
        const duration = req.body.duration;

        const savedexam = await Exam.create({
            questionset,
            totalMarks,
            duration,
        })
        return res.status(201).json({
            "msg": "Exam crteated successfully!!",
            "data": savedexam
        });
    } catch (error) {
        return res.status(500).json({ "error": error })
    }
};

export const getexam = async (req: any, res: any) => {
    try {
        const {exam_id} = req.params;
        console.log(exam_id)
        const exam = await Exam.findById(exam_id);
        return res.status(200).json({
            "exam": exam
        })
    } catch (error) {
        return res.status(500).json({ "error": error })
    }
};

export default router;