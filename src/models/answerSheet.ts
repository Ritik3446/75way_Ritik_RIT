import mongoose from 'mongoose';
import { AnswerSchema } from './answerSchema';

export const answerSheet = new mongoose.Schema({
    Exam_id: {
        type: String,
        required: true
    },
    student_id: {
        type: String,
        required: true
    },
    answerset:{
        type:[AnswerSchema],
        required: true
    },
});

export const submitSchema = mongoose.model('submitSchema', answerSheet);

export default submitSchema;