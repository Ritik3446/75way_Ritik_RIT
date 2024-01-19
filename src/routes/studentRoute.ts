import express, { Router } from 'express';
import { Request, Response } from 'express';
const router: Router = express.Router();
import { authenticateStudent } from '../Middleware/authMiddleware';
import { check, validationResult } from 'express-validator';

//controllers import
import { register,login,getexam, submitexam, getallanswers} from "../controllers/studentController";
import { generateresult, getresult } from '../controllers/resultController';

//routes
router.post('/register',[
    check('email', 'Invalid email Address, must contain 8-30 character and proper format')
                    .isEmail().isLength({ min: 8, max: 30 }),
    check('name', 'Name length should of maximum 20 characters')
                    .isLength({  max: 20 }),
    check('password', 'Password length should be minimum 8 and should contain one uppercase one lowercase and one special character')
                    .isLength({ min: 8, max: 10 }).isStrongPassword()
], (req: Request, res: Response) => {
    const errors = validationResult(req);

    // If some error occurs, then this
    // block of code will run
    if (!errors.isEmpty()) {
        res.json(errors)
    }else{
        register(req, res);
    }

});

router.post('/login', (req: Request, res: Response) => {
  login(req, res);
});

router.post('/getexam/:exam_id',authenticateStudent,(req: Request, res: Response) => {
    getexam(req, res);
});

router.post('/submitexam/:exam_id', authenticateStudent,(req: Request, res: Response) => {
    submitexam(req, res);
});

router.get('/getanswers/:exam_id', authenticateStudent, (req: Request, res: Response) => {
    getallanswers(req, res);
});

router.post('/generateresult/:exam_id', authenticateStudent, (req:Request,res:Response) =>{
    generateresult(req,res);
})

router.get('/getresult/:exam_id', authenticateStudent, (req: any, res: any) => {
    getresult(req, res);
});

export default router;