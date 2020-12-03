const { users } = require("../../models");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req,res) => {
    try {
        const schema = Joi.object({
            fullName: Joi.string().min(3).required(),
            email: Joi.string().email().min(6).required(),
            password: Joi.string().min(6).required(),
        });

        const { error } = schema.validate(req.body);
        if(error)
        return res.status(400).send({
            error: {
                message: error.details[0].message,
            },
        });

        const {fullName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await users.create({ ...req.body, password: hashedPassword });
        const token = jwt.sign({ id : users.id }, "our-secret-key");

        res.send({
            message : "Response Success",
            data : {
                user : {
                    email,
                    token,
                }
            },
        });
    } catch (error) {
        return res.status(500).send({
            error: {
                message: "Server Error",
            },
        });
    }
};