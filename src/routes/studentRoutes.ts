import { Router } from "express";
import { type Request, type Response } from 'express';
const router = Router();

router.get("/",(req: Request, res: Response) => {
    return res.json({
        success: true,
        message: "Student Information",
        data: {
            studentId: "670610722",
            firstName: "Bhumiphat",
            lastName: "Likittrakulwong",
            program: "CPE",
            section: "001"
        }
    });
});

export default router;
