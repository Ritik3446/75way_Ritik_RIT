import mongoose from 'mongoose';

export const AnswerSchema = new mongoose.Schema({
    _Id: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
});

export const Answer = mongoose.model('Answer', AnswerSchema);

export default Answer;