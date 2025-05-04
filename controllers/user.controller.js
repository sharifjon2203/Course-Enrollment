import { User } from "../models/user.model.js";
import { Course } from "../models/course.model.js";
import { courseValidator } from "../validators/course.validator.js";
import { catchError } from "../services/catchError.js";

export class UserCourseController {
    async createCourse(req, res) {
        try {
            const { error, value } = courseValidator(req.body);
            if (error) {
                return catchError(res, 400, error);
            }

            const course = await Course.create({
                ...value,
                createdBy: req.user.id,
            });

            return res.status(201).json({
                statusCode: 201,
                message: "success",
                data: course,
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async getAllCourses(req, res) {
        try {
            const courses = await Course.find().populate("createdBy", "username email");
            return res.status(200).json({
                statusCode: 200,
                message: "success",
                data: courses,
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async updateCourse(req, res) {
        try {
            const { id } = req.params;
            const { error, value } = courseValidator(req.body);
            if (error) {
                return catchError(res, 400, error);
            }

            const course = await Course.findById(id);
            if (!course) {
                return catchError(res, 404, "Course not found");
            }


            const updatedCourse = await Course.findByIdAndUpdate(id, value, {
                new: true,
            });

            return res.status(200).json({
                statusCode: 200,
                message: "success",
                data: updatedCourse,
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async deleteCourse(req, res) {
        try {
            const { id } = req.params;
            const course = await Course.findById(id);
            if (!course) {
                return catchError(res, 404, "Course not found");
            }



            await Course.findByIdAndDelete(id);
            return res.status(200).json({
                statusCode: 200,
                message: "success",
                data: {},
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async enrollCourse(req, res) {
        try {
            const { courseId } = req.params;
            const course = await Course.findById(courseId);
            if (!course) {
                return catchError(res, 404, "Course not found");
            }

            const user = await User.findById(req.user.id);
            if (user.enrolledCourses.includes(courseId)) {
                return catchError(res, 400, "Already enrolled in this course");
            }

            user.enrolledCourses.push(courseId);
            await user.save();

            return res.status(200).json({
                statusCode: 200,
                message: "success",
                data: { courseId },
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async getAllCourses(req, res) {
        try {
            const courses = await Course.find().populate("teacher", "username email");
            return res.status(200).json({
                statusCode: 200,
                message: "success",
                data: courses,
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }

    async updateUser(req, res) {
        try {
            const { id } = req.params;


            const { username, email, name } = req.body;
            const updatedUser = await User.findByIdAndUpdate(
                id,
                { username, email, name },
                { new: true, runValidators: true }
            );

            if (!updatedUser) {
                return catchError(res, 404, "User not found");
            }

            return res.status(200).json({
                statusCode: 200,
                message: "success",
                data: updatedUser,
            });
        } catch (error) {
            if (error.code === 11000) {
                return catchError(res, 409, "Email already in use");
            }
            return catchError(res, 500, error.message);
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            if (id !== req.user.id) {
                return catchError(res, 403, "Unauthorized to delete this user");
            }

            const user = await User.findByIdAndDelete(id);
            if (!user) {
                return catchError(res, 404, "User not found");
            }

            return res.status(200).json({
                statusCode: 200,
                message: "success",
                data: {},
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }
}