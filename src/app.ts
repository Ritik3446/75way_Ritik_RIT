import express, { Request, Response, Application } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();
import Examiner from './routes/examinerRoute';
import Student from './routes/studentRoute';
import connectDB from './config/examdb';

const app: Application = express();

app.use(express.json());
app.use(bodyParser.json());

connectDB();

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});

app.post('/', (req,res) =>{
    res.send("Listening");
})

app.use('/examiner',Examiner);
app.use('/student',Student);