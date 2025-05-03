import { model, Schema } from "mongoose"

const courseSchema = new Schema({
    title: String,
    description: String,
    teacher: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true })