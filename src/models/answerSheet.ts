import mongoose from 'mongoose';
import { AnswerSchema } from './answer';

export const sheetSchema = new mongoose.Schema({
    exam_id: {
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

export const answerSheet = mongoose.model('answerSheet', sheetSchema);

export default answerSheet;