// import { required } from "joi"
import { model, Schema } from "mongoose"

const userSchema = new Schema({
    name: String,
    email: {
        type: String, unique: true, required: true, trim: true, // Remove whitespace
        lowercase: true
    },
    hashedPassword: String,
    enrolledCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    refreshToken: String
}, { timestamps: true })

export const User = model('User', userSchema) 
