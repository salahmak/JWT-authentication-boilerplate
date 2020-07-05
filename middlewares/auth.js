const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const {
    validateLogin,
    validateRegister,
} = require("../validation/validation.js");

const register = async (req, res, db) => {
    const { name, email, password } = req.body;
    const user = { id: nanoid(), name, email };

    //validate the recieved data
    const { error } = validateRegister(req.body);
    if (error) return res.status.json(error.details[0].message);

    try {
        //checking if the email exists before
        const userExists = await db.collection("users").findOne({ email });
        if (userExists)
            return res.json("there is an existing user with that email");

        //hashing the password using bcrypt
        const hash = await bcrypt.hash(password, 10);

        //storing the user and the hash in the db
        await db.collection("users").insertOne(user);
        await db.collection("auth").insertOne({ id: user.id, hash });

        //assigning a JWT and sending it to the user
        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY);
        res.header("auth-token", token).json(token);
    } catch (err) {
        res.status(400).json("there has been an error while creating a user");
    }
};

const signIn = async (req, res, db) => {
    const { email, password } = req.body;

    try {
        //validate data
        const { error } = validateLogin(req.body);
        if (error) return res.status(400).json(error.details[0].message);

        const userExist = await db.collection("users").findOne({ email });
        if (!userExist)
            return res.status(400).json("there is no user with that email");

        const { hash } = await db
            .collection("auth")
            .findOne({ id: userExist.id });
        const isValid = await bcrypt.compare(password, hash);
        if (!isValid) return res.status(400).json("password doesn't match");

        //assigning a JWT and sending it to the user
        const token = jwt.sign({ id: userExist.id }, process.env.SECRET);
        res.header("auth-token", token).json(token);
    } catch (err) {
        res.status(400).json(err.stack);
    }
};

module.exports = {
    signIn,
    register,
};
