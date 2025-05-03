import Joi from "joi";

// const user = Joi.object({
//     username: Joi.string().min(3).max(20).required(),
//     password: Joi.string().min(8).max(22).required(),
//     email: Joi.string().email().required()
// });

// export const userValidator = (data) => {
//     const result = user.validate(data, { abortEarly: false });
//     console.log("userValidator result:", result); // Debug log
//     return result;
// };



export const userValidator = (data) => {
    const user = Joi.object({
        name: Joi.string().min(3).max(20).required(),
        password: Joi.string().min(8).max(22).required(),
        email: Joi.string().email().required()
    });
    return user.validate(data);
};