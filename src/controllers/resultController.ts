import { User } from '../models/user';
import { Exam } from '../models/exam';
import { answerSheet } from '../models/answerSheet';
import { Result } from '../models/result';
import express from 'express';
import { ResultWithContextImpl } from 'express-validator/src/chain';
const router = express.Router();

export const generateresult = async (req: any, res: any) => {
    const { exam_id } = req.params;
    const student: any = await User.findById({ _id: res.locals.user.userId });
    const exam: any = await Exam.findById(exam_id);

    const alreadyGenerated = await Result.findOne({ exam_id: exam_id, student_id: res.locals.user.userId });
    if (!alreadyGenerated) {
        const answer: any = await answerSheet.findOne({ exam_id: exam_id, student_id: res.locals.user.userId });

        if (answer) {
            const questionset = exam.questionset;
            const answerset = answer.answerset;

            let obtained = 0;
            [...questionset].forEach(element => {
                const answerobj = [...answerset].find((obj) => obj.question_id == element._id.valueOf())
                if (answerobj && answerobj.answer == element.correct_option) {
                    obtained = obtained + element.marks;
                }
                else {
                        obtained = obtained - (element.marks / 4);
                }
            });
            if(obtained < 0){
                obtained = 0;
            }
            const result = new Result({
                name: student.name,
                exam_id: exam_id,
                student_id: res.locals.user.userId,
                totalMarks: exam.totalMarks,
                obtainedMarks: obtained
            });
            await result.save();
            return res.status(200).json({
                "Result": result
            });
        } return res.status(401).json({
            "msg": "Exam not submitted!!"
        })
    }
    else {
        return res.status(500).json({
            "msg": "Result already generated! Click getresult to see your result."
        })
    }


}


export const getresult = async (req: any, res: any) => {
    try {
        const { exam_id } = req.params;

        const result = await Result.findOne({ exam_id: exam_id, student_id: res.locals.user.userId })
        if (result) {
            return res.status(200).json({
                "result": result
            })
        }
        return res.status(401).json({
            "msg": "Result not generated yet!!"
        })

    } catch (error) {
        return res.status(500).json({ "error": error })
    }

}

export const getallresult = async (req: any, res: any) => {
    try {
        const { exam_id } = req.params;
        const results = await Result.find({ Exam_id: exam_id });
        res.status(200).json({
            "results": results
        })
    } catch (error) {
        return res.status(500).json({ "error": error })
    }
}

export default router
