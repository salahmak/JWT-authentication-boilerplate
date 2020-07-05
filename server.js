const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const { signIn, register } = require("./middlewares/auth.js");

require("dotenv").config();

const app = express();
app.use(express.json());

const PORT = 3000;
const DB_URL = process.env.DB_URL;

let db;

//add verifyToken middleware to routes to secure them
//verifyToken makes req.user available in the route it is used in

//pass req, res, db to the register function so it works find
app.post("/register", (req, res) => register(req, res, db));
app.post("/login", (req, res) => signIn(req, res, db));

//and you have a ready to use authentication system in 2 lines

MongoClient.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((client) => {
        console.log("connected to db");
        app.listen(PORT, () => {
            console.log(`app is listening at http://localhost:${PORT}`);
        });
        db = client.db();
    })
    .catch((err) => {
        console.log(err);
    });
