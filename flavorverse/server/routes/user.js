/* eslint-disable no-undef */
const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../auth");

// userRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const userRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;


// This section will help you get a list of all the records.
// userRoutes.route("/user").get(function (req, res) {
//     let db_connect = dbo.getDb("FlavorVerse");
//     db_connect
//         .collection("users")
//         .find({})
//         .toArray(function (err, result) {
//             if (err) throw err;
//             res.json(result);
//         });
// });

// This section will help you get a single record by id
// userRoutes.route("/user/:id").get(function (req, res) {
//     let db_connect = getDb();
//     let myquery = { _id: ObjectId(req.params.id) };
//     db_connect
//         .collection("users")
//         .findOne(myquery, function (err, result) {
//             if (err) throw err;
//             res.json(result);
//         });
// });

userRoutes.route('/').get(auth, async function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = { _id: new ObjectId(req.user) };
    const user = await db_connect.collection("users").findOne(myquery);
    if (!user) return res.json(false);
    return res.json({
        id: user._id,
        username: user.username
    });
})

userRoutes.route('/tokenIsValid').post(async function (req, res) {
    try {
        let db_connect = dbo.getDb();
        const token = req.header("x-auth-token");
        if (!token) return res.json(false);
        const verified = jwt.verify(token, "passwordKey");
        if (!verified) return res.json(false);
        let myquery = { _id: new ObjectId(verified.id) };
        const user = await db_connect.collection("users").findOne(myquery);
        if (!user) return res.json(false);
        return res.json(true);
    } catch (error) {
        res.status(500).json({ msg: "user: " + error.message });
    }
});

// Finds user from matching email and password
userRoutes.route('/login').post(async function (req, res) {
    let db_connect = dbo.getDb();
    const { email, password } = req.body;

    const existingUser = await db_connect.collection("users").findOne({ email });
    if (!existingUser) {
        return res.status(400).json({ msg: "Email isnt registered" });
    }

    const passwordCompare = await bcryptjs.compare(password, existingUser.password)
    if (!passwordCompare) {
        return res.status(400).json({ msg: "Password is incorrect" });
    }

    const token = jwt.sign({ id: existingUser._id }, "passwordKey");

    res.json({ token, existingUser });
});

// This section will help you create a new user.
userRoutes.route('/register').post(async function (req, response) {
    let db_connect = dbo.getDb();
    const { username, email, password, confirmPassword } = req.body;
    if (confirmPassword !== password) {
        return response.status(400).json({ msg: "Both the passwords dont match" });
    }
    const existingUser = await db_connect.collection("users").findOne({ email });
    if (existingUser) {
        return response.status(400).json({ msg: "User with the same email already exists" });
    }
    const hashedPassword = await bcryptjs.hash(password, 8);
    let newUser = {
        username: username,
        email: email,
        password: hashedPassword
    }

    const addedUser = await db_connect.collection("users").insertOne(newUser);
    if (addedUser)
        response.json(addedUser);
});

module.exports = userRoutes;