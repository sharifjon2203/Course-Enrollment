import { User } from "../models/user.model.js";
import { catchError } from "../services/catchError.js";
import jwt from "jsonwebtoken"
import { generateOtp, verifyOtp } from "../services/generate.otp.js"
import { getCache, setCache } from "../services/cache.js"
import { userValidator } from "../validators/user.validator.js"


import { decode, encode } from '../services/bcrypt-encrypt.js';
import { generateAccessToken, generateRefreshToken } from '../services/generate-token.js';
import { transporter } from "../services/mailer.js"

export class UserAuthController {

    async loginUser(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return catchError(res, 404, 'User not found');
            }
            const isMatchPassword = await encode(password, user.hashedPassword);
            if (!isMatchPassword) {
                return catchError(res, 400, 'Invalid password');
            }

            const otp = await generateOtp()

            const mailMessage = {
                from: process.env.SMTP_USER,
                to: 'sharifjoncodm@gmail.com',
                subject: 'OTP Code:',
                text: `OTP Code: ${otp}`,
            };

            transporter.sendMail(mailMessage, function (err, info) {
                if (err) {
                    console.log(`Error on sending to mail: ${err}`)
                    return catchError(res, 400, err);
                } else {
                    // console.log(info);
                    setCache(user.email, otp)

                }
            });


            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: {}
            });


        } catch (error) {
            console.log(error)
            return catchError(res, 500, error.message);
        }
    }

    async confirmLoginUser(req, res) {
        try {
            const { email, otp } = req.body
            const user = await User.findOne({ email })

            if (!user) {
                return catchError(res, 404, "User not found")
            }

            const otpCache = getCache(email)
            if (!otpCache || otp != otpCache) {
                return catchError(res, 500, "OTP expired")
            }

            const payload = { id: user._id };
            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 30 * 24 * 60 * 60 * 1000
            });

            return res.status(200).json({
                statusCode: 200,
                message: "success",
                data: accessToken
            })


        } catch (e) {
            return catchError(res, 500, e.message)
        }
    }



    async signOut(req, res) {
        try {

            const refreshToken = req.cookies.refreshToken
            if (!refreshToken) {
                return catchError(res, 401, "Refresh token not found")
            }
            const decodeToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY)
            if (!decodeToken) {
                return catchError(res, 401, "refresh token expired")
            }

            res.clearCookie("refreshToken")
            return res.status(200).json({
                statusCode: 200,
                message: "success",
                data: {}
            })
        } catch (e) {
            return catchError(res, 500, e)
        }
    }


    async signIn(req, res) {
        try {
            // console.log(`body - ${req.body}`)
            const { error, value } = userValidator(req.body);
            if (error) {
                return catchError(res, 400, error);
            }

            // console.log(`Value" - ${value}\nError - ${error}`)

            const { username, password, email } = value;
            const hashedPassword = await decode(password, 7);

            const user = await User.create({
                username, hashedPassword, email
            });
            return res.status(201).json({
                statusCode: 201,
                message: 'success',
                data: user
            });
        } catch (error) {
            // console.log(error)
            if (error.code === 11000) {
                return catchError(res, 409, "User already exists!");
            } else {
                return catchError(res, 500, error.message);
            }

        }
    }



    async accessToken(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return catchError(res, 401, 'Refresh token not found');
            }
            const decodedToken = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_KEY
            );
            if (!decodedToken) {
                return catchError(res, 401, 'Refresh token expired');
            }
            const payload = { id: decodedToken.id };
            const accessToken = generateAccessToken(payload);
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: accessToken,
            });
        } catch (error) {
            return catchError(res, 500, error.message);
        }
    }


    async logout(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return catchError(res, 401, 'Refresh token not found');
            }
            const decodedToken = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_KEY
            );
            if (!decodedToken) {
                return catchError(res, 401, 'Refresh token expired');
            }
            res.clearCookie('refreshToken');
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: {},
            });
        } catch (error) {
            return catchError(res, 500, error);
        }
    }



}



