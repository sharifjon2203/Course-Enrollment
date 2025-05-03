import Joi from "joi";

const course = Joi.object({
    title: Joi.string().min(4).max(100).required(),
    description: Joi.string().min(8).required(),
    teacher: Joi.string().required()
});

export const courseValidator = (data) => {
    return course.validate(data);
}