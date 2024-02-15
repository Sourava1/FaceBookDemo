const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
    {
        userId:{
            type:String,
            required:true
        },
        desc:{
            type:String,
            max:500
        },
        img:{
            type:String,
        },
        likes:{
           type:Array,
           default:[] 
        },
        comments:{
            type: Array,
            default:[3]
        },
        date:{
            type: Date, 
            default: Date.now,
        },
    },
//whenever you create a Post and update this it's gonna Automatically update the timestamp
{timestamps:true}
);
//the first argument ('User' in this case) represents the singular name of the collection that will be created for your model in the MongoDB database
module.exports = mongoose.model("Post",PostSchema);

