const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

//REGISTER
router.post("/register",async (req,res) =>{
    // const newUser = await new user({
    //     username:"sonu",
    //     email:"soonu@gmail.com",
    //     password:"123456"
    // })

    // await newUser.save();//This is also await because it writing in the database here
    // res.send("ok ")
    
    try{
        //generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);

        //create new user
        const data={
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        }
        // const newUser = await User.create(data);
        const newUser = await new User(data);  

        //save user and return responce
        const saveduser =await newUser.save();
        
        console.log(saveduser);
        res.status(200).json(saveduser);
    }catch(err){
        res.status(500).json(err);
    }
});


//Login
router.post("/login",async(req,res)=>{
    try{
        const foundUser = await User.findOne({email:req.body.email})
        //if there is no user
        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const validPassword = await bcrypt.compare(req.body.password,foundUser.password)
        if(!validPassword){
            return res.status(400).json({message:"wrong Password"});
        }else{
            return res.status(200).json(foundUser);
        }
    }
    catch(err){
        res.status(500).json(err);
    }
});

module.exports = router

