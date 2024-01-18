import { QuestionSchema } from './questionSchema';
import mongoose from 'mongoose';

export const examSchema = new mongoose.Schema({
    questionset:{
        type:[QuestionSchema],
        default:undefined,
        required:true
    },
    totalMarks :{
        type:String,
        required: true
    }
})

export const Exam = mongoose.model('Exam', examSchema);

export default Exam;
