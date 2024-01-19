import { QuestionSchema } from './question';
import mongoose from 'mongoose';

export const examSchema = new mongoose.Schema({
    questionset:{
        type:[QuestionSchema],
        default:undefined,
        required:true
    },
    totalMarks :{
        type:Number,
        required: true
    },
    duration:{
        type:Number,
        required:true
    }
})

export const Exam = mongoose.model('Exam', examSchema);

export default Exam;
