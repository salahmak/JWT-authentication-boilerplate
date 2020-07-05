const Joi = require("@hapi/joi");

const validateRegister = (data) => {
    const userSchema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().max(40).required(),
        password: Joi.string().min(6).max(26).required(),
    });
    return userSchema.validate(data);
};

const validateLogin = (data) => {
    const userSchema = Joi.object({
        email: Joi.string().email().max(40).required(),
        password: Joi.string().min(6).max(26).required(),
    });
    return userSchema.validate(data);
};

module.exports = {
    validateLogin,
    validateRegister,
};
