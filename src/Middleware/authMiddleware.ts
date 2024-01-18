import express,{Request,Response,NextFunction} from 'express';
import jwt from 'jsonwebtoken';
export const authenticateExaminer = (req:Request, res:Response, next:NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, 'secretkeyrick' ) as any;
        if(!user){
            return res.status(403).json({
                "msg": "User not found"
            });
        }else{
            if(user.role == "Examiner"){
                next();
            }else{
                return res.status(404).json({
                    "msg": "This page is accessible to Examiner only"
                });
            }
        }
    } else {
        return res.status(401).json({
            "msg": "Authentication header not provided"
        });
    }
};

export const authenticateStudent = (req:Request, res:Response, next:NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token , 'secretkeyrick' ) as any;
        res.locals.user = user;
        if(!user){
            return res.status(403).json({
                "msg": "User not found"
            });
        }else{
            if(user.role == "Student"){
                next();
            }else{
                return res.status(404).json({
                    "msg": "This page is accessible to Students only"
                });
            }
        }
    } else {
        return res.status(401).json({
            "msg": "Auth header not provided"
        });
    }
};
