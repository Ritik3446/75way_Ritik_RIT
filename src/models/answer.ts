import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

export const AnswerSchema = new mongoose.Schema({
    question_id:{
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
});
