import { User } from '../models/user';
import { Exam } from '../models/exam';
import { answerSheet } from '../models/answerSheet';
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
            "student": student
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
    const {exam_id} = req.params;
    try {
        const exam = await Exam.findById(exam_id);
        if(exam){
            const {questionset, totalMarks} = exam;
            return res.status(200).json({
                "exam":{
                    questionset,
                    totalMarks,
                    exam_id,
                    remaining_time : exam.duration
                }
            })
        }
        return res.status(401).json('exam not found with given exam id')
    } catch (error) {
        return res.status(500).json({ "error": error })
    }
};

export const submitexam = async (req: any, res: any) => {
    const {exam_id} = req.params;
    const exam:any = await Exam.findById(exam_id);
    if(exam){
        const alreadySubmitted = await answerSheet.findOne({student_id:res.locals.user.userId});

        if(!alreadySubmitted){
            try {
                const answer = new answerSheet({
                    exam_id: exam_id,
                    student_id: res.locals.user.userId,
                    answerset: req.body.answerset
                });
                await answer.save();
                return res.status(200).json({
                    "answer":answer
                });
            } catch (error) {
                return res.status(500).json({ "error": error })
            }
        }
        return res.status(500).json({"msg":'Your exam has been submitted already! Click on getanswers to see your answers'});
    }
    return res.status(401).json({'No Exam found with the entered Exam_id':req.body.Exam_id});
};

export const getallanswers = async (req: any, res: any) => {
    const {exam_id} = req.params;
    try {
        const answers = await answerSheet.findOne({exam_id:exam_id,student_id:res.locals.user.userId});
        if(answers){
            return res.status(200).json({
                "answers":answers
            })
        }
        return res.status(401).json({
            "msg":"exam not submitted"
        })
    } catch (error) {
        return res.status(500).json({ "error": error })
    }
};

export default router;