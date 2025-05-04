import { model, Schema } from "mongoose"

const courseSchema = new Schema({
    title: String,
    description: String,
    teacher: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    }
}, { timestamps: true })

export const Course = model('Course', courseSchema) 
