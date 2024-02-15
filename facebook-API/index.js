const express = require("express");
const app = express();
const PORT = process.env.PORT || 5500; 
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require('body-parser');

const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const deleteDataRoute = require("./routes/deleteDataRoute");
const conversationRoute = require("./routes/Conversations");//File path including folder
const messageRoute = require("./routes/messages");

const postRoute = require("./routes/posts");
const cors = require("cors"); 
//Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
const multer = require("multer");
//You can use the path module to perform various operations on file and directory paths, such as joining, parsing, normalizing, resolving, and formatting. To include the path module, you can use the require() method:
const path = require("path");


dotenv.config();

//connect to Mongodb--2
 mongoose.connect(process.env.MONGO_URL,{writeConcern: { w: 'majority', wtimeout: 0, j: false }, })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

  //here i indicate my images path and indicate my folder name by express.static(path.join(__dirname,"public/images")))
  app.use("/images",express.static(path.join(__dirname,"public/images")));

  //middleware--3
  app.use(express.json());
  app.use(helmet());
  app.use(morgan("Common"));
  app.use(bodyParser.json());

  const storage = multer.diskStorage({
    destination:(req,file,cb) => {//Specifies the destination directory for storing the uploaded files. It takes three parameters: req (request object), file (file information), and cb (callback function).
      cb(null, "public/images");//Calls the callback function (cb) with two arguments - null (indicating no error) and the destination path where the uploaded files should be stored, in this case, "public/images".
    },
    filename:(req,file,cb) => {
      //cb(null,req.body.name);//req.body.name is for taking file name because in Share.jsx we pass filename
      cb(null, Date.now() + "-" + file.originalname);
    }
  });

  const upload = multer({storage});//inside multer() we have to indicate our storage
  app.post("/api/upload",upload.single("file"), (req,res) => {
    try{
        return res.status(200).json(req.file.filename);
    }catch(err){
      console.log(err);
    }
  });

  // Add CORS middleware
  app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies
  }));
  

 app.use("/api/users",userRoute);
 app.use("/api/auth",authRoute);
 app.use("/api/posts",postRoute);
 app.use("/api/deleteAll", deleteDataRoute);
 app.use("/api/conversation",conversationRoute);
 app.use("/api/messages",messageRoute);


//connect to port--1
app.listen(PORT, (error) =>{ 
    if(!error){
        console.log("Server is Successfully Running, and App is listening on port "+ PORT) 
    }else{
        console.log("Error occurred, server can't start", error); 
    } 
}); 
