import { Router, type Request , type Response } from "express";
import { students, courses } from "../db/db.js";
import { type Course , type Student } from "../libs/types.js";
import { zStudentId } from "../schemas/studentValidator.js";
import { zCourseId, zCoursePostBody, zCoursePutBody, zCourseDeleteBody } from "../schemas/courseValidator.js"

const router: Router = Router();

// READ all
router.get("/", (req: Request, res: Response) => {
     try {
        return res.status(200).json({
            success: true,
            data: students.map((student) => student),
        });
    } catch (err) {
        return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: err,
        });
    }
});

// Params URL 
router.get("/courses", (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            data: courses.map((course) => course),
        });
    } catch (err) {
        return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: err,
        });
    }
});

router.get("/students/:studentId/courses", (req: Request, res: Response) => {
    try {
        const studentId = req.params.studentId;
        const result = zStudentId.safeParse(studentId);

        const body = req.body as Student;

        if (!result.success) {
        return res.status(400).json({
            message: "Validation failed",
            errors: result.error.issues[0]?.message,
        });
        }

        const foundIndex = students.findIndex(
        (student) => student.studentId === studentId
        );

        if (foundIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Student does not exists",
        });
        }

        res.set("Link", `/students/${studentId}/courses`);

        const resultCourses = students[foundIndex]?.courses?.map((courseId) => {
            const course = courses.find((c) => c.courseId === courseId);
            return {
                courseId: course?.courseId,
                courseTitle: course?.courseTitle
            };
        });

        return res.status(200).json({
        success: true,
        message: `Get courses detail of student ${studentId}`,
        data: {
            studentId: studentId,
            courses: resultCourses,
        }
        });
    } catch (err) {
        return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: err,
        });
    }
});

router.get("/courses/:courseId", (req: Request, res: Response) => {
    try {
        const courseId = req.params.courseId;
        const result = zCourseId.safeParse(Number(courseId));

        const body = req.body as Course;

        if (!result.success) {
        return res.status(400).json({
            message: "Validation failed",
            errors: "Invalid input: expected number, received NaN"
        });
        }

        const foundIndex = courses.findIndex(
        (course) => course.courseId === Number(courseId)
        );

        if (foundIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Course does not exists",
        });
        }

        res.set("Link", `/courses/${courseId}`);

        return res.status(200).json({
        success: true,
        message: `Get courses ${courseId} successfully`,
        data: {
            courseId: courseId,
            courseTitle: courses[foundIndex]?.courseTitle,
            instructors: courses[foundIndex]?.instructors,
        }
        });
    } catch (err) {
        return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: err,
        });
    }
});

router.post("/courses", (req: Request, res: Response) => {
    try {
        const body = req.body as Course;
        const result = zCoursePostBody.safeParse(body); 
        if (!result.success) {
        return res.status(400).json({
            message: "Validation failed",
            errors: result.error.issues[0]?.message,
        });
        }

        const found = courses.find(
        (course) => course.courseId === body.courseId
        );
        if (found) {
        return res.status(409).json({
            success: false,
            message: "Course Id already exists",
        });
        }

        const new_course = body;
        courses.push(new_course);

        res.set("Link", `/courses/${new_course.courseId}`);

        return res.status(200).json({
        success: true,
        message: `Course ${body.courseId} has been added successfully`,
        data: new_course,
        });
    } catch (err) {
        return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: err,
        });
    }
});

router.put("/courses", (req: Request, res: Response) => {
    try {
        const body = req.body as Course;

        const result = zCoursePutBody.safeParse(body); 
        if (!result.success) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: result.error.issues[0]?.message,
        });
        }


        const foundIndex = courses.findIndex(
        (course) => course.courseId === body.courseId
        );

        if (foundIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Course Id does not exists",
        });
        }


        courses[foundIndex] = { ...courses[foundIndex], ...body };

        res.set("Link", `/courses/${body.courseId}`);

        return res.status(200).json({
        success: true,
        message: `course ${body.courseId} has been updated successfully`,
        data: courses[foundIndex],
        });
    } catch (err) {
        return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: err,
        });
    }
});

router.delete("/courses", (req: Request, res: Response) => {
    try {
        const body = req.body;
        const parseResult = zCourseDeleteBody.safeParse(body);

        if (!parseResult.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: parseResult.error.issues[0]?.message,
            });
        }

        const foundIndex = courses.findIndex(
        (course: Course) => course.courseId === body.courseId
        );
        if (foundIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Course Id does not exists",
            });
        }

        const deletecourse = courses[foundIndex];
        courses.splice(foundIndex, 1);

        return res.status(200).json({
            success: true,
            message: `Course ${deletecourse?.courseId} has been deleted successfully`,
            data: deletecourse,
        });
    } catch (err) {
        return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: Error,
        });
    }
});

export default router;
