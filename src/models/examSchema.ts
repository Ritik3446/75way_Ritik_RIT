import mongoose from 'mongoose';

export const QuestionSchema = new mongoose.Schema({
    description: String,
    alternatives: [
        {
            text: {
                type: String,
                required: true
            },
        }
    ],
    correct_option :{
        type:String,
        required: true
    }
})

export const Question = mongoose.model('Question', QuestionSchema);

export default Question;