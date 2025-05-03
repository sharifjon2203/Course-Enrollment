import { Router } from "express"

import { UserAuthController } from "../controllers/user.auth.controller.js"
import { JwtAuthGuard } from "../middlewares/jwt-auth.guard.js"

const router = Router()
const controller = new UserAuthController()

router
    .post("/register", controller.signIn)
    .post("/login", controller.loginUser)
    .post("/confirm-login", controller.confirmLoginUser)
    .post("/accesToken", controller.accessToken)
    .post("/logout", JwtAuthGuard, controller.logout)


export default router
