import { Router } from "express";
import { UserAuthController } from "../controllers/user.auth.controller.js";
import { JwtAuthGuard } from "../middlewares/jwt-auth.guard.js";
import { UserCourseController } from "../controllers/user.controller.js";

const router = Router();
const authController = new UserAuthController();
const courseController = new UserCourseController();

router
    .post("/register", authController.signIn)
    .post("/login", authController.loginUser)
    .post("/confirm-login", authController.confirmLoginUser)
    .post("/accesToken", authController.accessToken)
    .post("/logout", JwtAuthGuard, authController.logout)
    .post("/courses", JwtAuthGuard, courseController.createCourse)
    .get("/courses", JwtAuthGuard, courseController.getAllCourses)
    .put("/courses/:id", JwtAuthGuard, courseController.updateCourse)
    .delete("/courses/:id", JwtAuthGuard, courseController.deleteCourse)
    .post("/enroll/:courseId", JwtAuthGuard, courseController.enrollCourse)
    .get("/me/courses", JwtAuthGuard, courseController.getAllCourses)
    .put("/:id", JwtAuthGuard, courseController.updateUser)
    .delete("/:id", JwtAuthGuard, courseController.deleteUser);

export default router;