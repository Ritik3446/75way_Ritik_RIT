import express, { Router } from 'express';
import { Request, Response } from 'express';
import { authenticateExaminer } from '../Middleware/authMiddleware';
const router: Router = express.Router();
import { check, validationResult } from 'express-validator';
import { register, login, createexam, getexam } from "../controllers/examinerController";

router.post('/register',[
    check('email', 'Invalid email Address, must contain 8-30 character')
                    .isEmail().isLength({ min: 8, max: 30 }),
    check('name', 'Name length should of maximum 20 characters')
                    .isLength({  max: 20 }),
    check('password', 'Password length should be 8 to 10 characters')
                    .isLength({ min: 8, max: 10 })
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

router.post('/createExam',authenticateExaminer, (req: Request, res: Response) => {
    createexam(req, res);
});

router.get('/getexam',authenticateExaminer, (req: Request, res: Response) => {
    getexam(req, res);
});

export default router;
