const router = require("express").Router();
const Conversation = require("../models/Conversation");

//new Conversation
router.post("/",async(req,res) =>{
    const newConversation = new Conversation({
     //here members is the Attribute of Conversation schema
     members: [req.body.senderId,req.body.receiverId],
    });
 
    try{
         const savedConversation = await newConversation.save();
         res.status(200).json(savedConversation);
    }catch(err){
         res.status(500).json(err);
    }
 })
 
 //get Conversation of a user

 router.get("/:userId",async(req,res)=>{
    try{
        //Here Conversation is the schmea name of Conversations.js Modal
        const conversation = await Conversation.find({//find method to retrieve documents from the "Conversation" collection based on a specified condition.
            //$in: This is a MongoDB operator that selects the documents where the value of a field equals any value in the specified array.
            members:{$in:[req.params.userId]}
        })
        res.status(200).json(conversation);
    }catch(err){
        res.status(500).json(err);
    }
 })

 //get conv includes 2 userId
 router.get("/find/:firstUserId/:secondUserId",async(req,res) =>{
    try{
            const conversation = await Conversation.findOne({
                members:{$all:[req.params.firstUserId,req.params.secondUserId]},
            });
            res.status(200).json(conversation);
    }catch(err){
        res.status(500).json(err);
    }
 })

module.exports = router;