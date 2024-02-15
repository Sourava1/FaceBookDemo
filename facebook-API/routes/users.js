const express = require("express");
const router = express.Router();
const User= require("../models/User");
const bcrypt = require("bcrypt");
//update user
router.put("/:id",async(req,res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password,salt);
            }catch(err){
                return res.status(500).json(err);
            }
        }
        try{
            const updatedUser = await User.findByIdAndUpdate(req.params.id,{
                $set:req.body//it automatically set all input inside this body
            },{new:true});
            res.status(200).json("Account has been updated")
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res.status(403).json("You can update only your Account");
    }
});
//delete user
router.delete("/:id",async(req,res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            const deleteUser = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been Deleted Sucessfully")
        }catch(err){
            return res.status(500).json(err); 
        }
    }else{
        return res.status(403).json("You can delete only your Account");
    }
});
//get a user

router.get("/",async(req,res)=>{
    const userId = req.query.userId;
    const username = req.query.username;
    try{
        const finduser = userId ? await User.findById(userId)//if there is userId
        : await User.findOne({ username : username }) ;//if there is no userId or if there is username
        //find user returns unnecessary properties like (isAdmin,password and more) while returning data ,so for avoiding this we have to write below code
        const {password,updatedAt,...other} = finduser._doc//this _doc basically carries all object of API json 
        res.status(200).json(other)//here i avoid password and updatedAt and only sending rest of it
    }catch(err){
        return res.status(500).json(err)
    }
})

//get friends//for this i will give my user id fetch my data but not all data (only following)
router.get("/friends/:userId",async(req,res) => {
    try{
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.following.map((friendId) => {
                return User.findById(friendId)
            })
        )//for not fetching all the properties of friends id
        let friendList = [];
        friends.map(friend => {
            const {_id,username,profilePicture} = friend;
            //now push the above 3 properties into the array
            friendList.push({_id,username,profilePicture});
        });
        res.status(200).json(friendList);

    }catch(err){
        return res.status(500).json(err);
    }
});
//follow a user
router.put("/:id/follow", async(req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
            //find user which has this id
            const followAuser = await User.findById(req.params.id);
            //find Current User
            const Currentuser = await User.findById(req.body.userId);
            //here followers is the attribute of schema of our model
            if(!followAuser.followers.includes(req.body.userId)){
                await followAuser.updateOne({$push:{followers:req.body.userId}});//we are going to some id inside followers
                //Now going to do samething for current user
                await Currentuser.updateOne({$push:{following:req.params.id}});
                res.status(200).json("user has been followed"); 
            }else{
                res.status(403).json("you already follow this user");
            }
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("you can't follow yourself")
    }
})
//unfollow a user
router.put("/:id/unfollow", async(req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
            //find user which has this id
            const followAuser = await User.findById(req.params.id);
            //find Current User
            const Currentuser = await User.findById(req.body.userId);
            //here followers is the attribute of schema of our model
            if(followAuser.followers.includes(req.body.userId)){
                await followAuser.updateOne({$pull:{followers:req.body.userId}});//we are going to some id inside followers
                //Now going to do samething for current user
                await Currentuser.updateOne({$pull:{following:req.params.id}});
                res.status(200).json("user has been unfollowed"); 
            }else{
                res.status(403).json("you don't follow this user");
            }
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("you can't follow yourself")
    }
})
module.exports = router