const express = require("express");
const router = express.Router();
const db = require('../db.js');

//Get users in the system
router.get("/", async (req, res) => {
    try {
        let responseData = await db.query(`SELECT user_id AS id, name, age, location FROM users`);
        return res.send(responseData);
    } catch(err) {
        res.status(500);
        return res.send({msg: "Server error"});
    }
});

//Create a user in the system
router.post("/", async (req, res) => {
    const {name, age, location} = req.body;
    //Validate data
    if(typeof name !== 'string' ||
        typeof age !== 'number' ||
        typeof location !== 'string') {
            res.status(400);
            return res.send({msg: "Invalid input received. Name must be string. Age must be a number. Location must be a string"});
    }
    try {
        let insertResponse = await db.query(`INSERT INTO users (name, age, location) VALUES (?,?,?)`, [name, age, location]);
        if(insertResponse.affectedRows === 1) {
            // return res.send("User created with ID of " + insertResponse.insertId);
            return res.send({"userId" : insertResponse.insertId});
        } else {
            res.status(500);
            return res.send({msg: "Unable to create user"});
        }
    } catch(err) {
        res.status(500);
        return res.status({msg: "Server error"});
    }
});

module.exports = router;