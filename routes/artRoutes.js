const express = require('express');
const router = express.Router();
const db = require('../db.js');
const axios = require('axios');

router.get("/", async (req, res) => {
    try {
        let response = [];
        let artData = await db.query(`SELECT * FROM art`);
        for(let i=0; i<artData.length; i++) {
            let artItem = {
                id: artData[i].art_id,
                title: artData[i].title,
                artist: artData[i].artist,
                year: artData[i].year,
                comments: []
            }
            //Load art item comments
            artItem = await getArtWithComments(artItem);
            response.push(artItem);
        }
        return res.send(response);
    } catch(err) {
        res.status(500);
        res.send({msg: "Unable to get art"});
    }
});

router.get("/:id", async (req, res) => {
    //Validate data - verify that ID is a numeric value
    if(isNaN(req.params.id)) {
        res.status(400);
        return res.send({msg: "Please provide a numeric ID"});
    }
    try {
        let artResponse = await db.query(`SELECT * FROM art where art_id = ${req.params.id}`);
        if(artResponse.length == 0) {
            return res.send({msg: "No art data found"});
        }
        let artItem = {
            id: artResponse[0].art_id,
            title: artResponse[0].title,
            artist: artResponse[0].artist,
            year: artResponse[0].year > 0 ? artResponse[0].year : "Not available",
            comments: []
        }
        //Load art item comments
        artItem = await getArtWithComments(artItem);
        return res.send(artItem);
    } catch(err) {
        console.log(err);
        res.status(500);
        return res.send({msg: "Unable to get artData"});
    }
});

router.post("/:id/comments", async (req, res) => {
    //Validate data - verify that ID is a numeric value
    if(isNaN(req.params.id)) {
        res.status(400);
        return res.send({msg: "Please provide a numeric ID for art item"});
    }
    const {userId, name, content} = req.body;
    let userData = userId ? await checkForUser(userId) : false;
    let artId = await checkForArtItem(req.params.id);
    //Validate data - verify that content is present
    if(typeof content !== 'string') {
        res.status(400);
        return res.send({msg: 'A comment is required'});
    }
    //Validate data - If no user ID provided verify that name is present
    if(!userData) {
        if(typeof name !== 'string') {
            res.status(400);
            return res.send({msg: "A user id or name is required to make a comment"});
        }
    }
    //Verify that art item exists with that ID
    if(!artId) { 
        res.status(400);
        return res.send({msg: "No art with that ID found"});
    }
    //Adding a user with no user account
    if(!userData) {
        try {
            //Check that the comment entry is valid
            let commentsByUserName = await db.query(`SELECT * FROM comments WHERE comment_name = ? AND art_art_id = ? AND users_user_id = 1`, [name, artId]);
            if(commentsByUserName.length > 0) {
                res.status(400);
                return res.send({msg: "A comment with that name and no valid user ID already exists"});
            } else {
                try {
                    let addComment = await db.query(`INSERT INTO comments (content, art_art_id, users_user_id, comment_name) VALUES ('${content}', '${artId}', '1', '${name}')`);
                    if(addComment.affectedRows == 1) {
                        return res.send({msg: "Successfully created comment"});
                    } else {
                        res.status(500);
                        return res.send({msg: "Unable to add comment"});
                    }
                } catch(err) {
                    res.status(500);
                    return res.send({msg: "Unable to add comment"});
                }
            }
        } catch(err) {
            res.status(500);
            return res.send({msg: "Unable to add comment"});
        }
    } else {
        try {
            let addComment = await db.query(`INSERT INTO comments (content, art_art_id, users_user_id, comment_name) VALUES (?, ?, ?,?)`,[content, artId, userData.userId, userData.userName]);
            if(addComment.affectedRows == 1) {
                return res.send({msg: "Successfully created comment"});
            } else {
                res.status(500);
                return res.send({msg: "Unable to add comment"});
            }
        } catch(err) {
            res.status(500);
            return res.send({msg: "Unable to add comment"});
        }     
    }
});

const checkForUser = async (userId) => {
    let userData = false;
    //User ID 1 is reserved for anonymous users
    if(userId === 1) {
        return userData;
    }
    try {
        //Verify that user exists in the system
        let config = {
            method: 'get',
            url: `http://localhost:${process.env.SERVER_PORT}/api/users`
        }
        let userCheck = await axios(config);
        for(let i=0; i<userCheck.data.length; i++) {
            if(userCheck.data[i].id == userId) {
                userData = {
                    userId: userCheck.data[i].id,
                    userName: userCheck.data[i].name
                };
            }
        }
    } catch(err) {
        return false;
    }
    return userData;
}

const checkForArtItem = async (artId) => {
    try {
        //Check for art entry
        let config = {
            method: 'get',
            url: `http://localhost:${process.env.SERVER_PORT}/api/art/${artId}`,
        }
        let artResponse = await axios(config);
        if(artResponse.data.id) {
            return artId;
        } else {
            return false;
        }
    } catch(err) {
        return false;
    }
}

const getArtWithComments = async (artItem) => {
    let responseData = await db.query(`SELECT * 
    FROM art 
    JOIN comments ON art.art_id = comments.art_art_id 
    JOIN users ON comments.users_user_id = users.user_id
    AND art.art_id = ${artItem.id}`);
    if(responseData.length > 0) {
        for(let i=0; i<responseData.length; i++) {
            //Anonymous user
            if(responseData[i].users_user_id == 1) {
                let comment = {
                    id: responseData[i].comment_id,
                    name: responseData[i].comment_name,
                    content: responseData[i].content
                }
                artItem.comments.push(comment);
            } else {
                let comment;
                comment = {
                    id: responseData[i].comment_id,
                    name: responseData[i].comment_name,
                    content: responseData[i].content,
                    userId: responseData[i].users_user_id
                }
                artItem.comments.push(comment);
            }
        }
    }
    return artItem;
}

module.exports = router;