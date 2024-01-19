import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    exam_id:{
        type:String,
        required:true
    },
    student_id:{
        type:String,
        required: true
    },
    totalMarks: {
        type: String,
        required: true,
    },
    obtainedMarks: {
        type:String,
        required: true,
        ref: "Role"
    }
});

export const Result = mongoose.model('Result', resultSchema);

export default Result;




