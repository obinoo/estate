import Joi from 'joi';


export const signUpValidate = Joi.object({
    name: Joi.string().min(4).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().min(11).max(11).required(),
    house_no: Joi.string().required()

   
})

export const loginValidate = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
})