const io = require("socket.io")(8900,{
    cors:{
        origin : "http://localhost:3000",
    },
});

//1
let users = [];

//3(b)//for storing userID and socketId inside blank  users
const addUser = (userId,socketId) =>{
    //here condition is that (if same user inside this user we are not gonna add if it is unique we can push to users[])
    !users.some((user) => user.userId === userId) &&
    users.push({userId,socketId});
    //now inside [] there are socketId or userId
};

//6(b)//function for remove user from users[]
const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId );
};

//9(b)//function for getting specific user to send text message
const getUser = (userId) =>{
    return users.find(user=>user.userId === userId)
}


io.on("connection",(socket) =>{
    console.log("a user connected");

    //when connect
    //3(a)//take userId and socketId from user (socket)
    socket.on("addUser",userId =>{
            addUser(userId,socket.id);//socket.id (unique identifier of the connected socket) 
            //4(send)//to send this(which are present inside users[]) from server to  client
            io.emit("getUsers",users);
    });


    //send and get message
    //8()//Take event from client(suppose someone send a message then it will store on the server ..so from the server we have to take the message as a result it willl shows to us)
    socket.on("sendMessage",({senderId,receiverId,text})=>{
        //9(a)//find specific user to send this text message
        const user = getUser(receiverId);//receive saswat's id
        //9(c)//for sending message to specific user(saswat)//io.to(SocketID).emit
        io.to(user.socketId).emit("getMessage",{
            senderId,
            text,
        })

    })



    //when Disconnect
    //5//if somebody disconnect from socket server//Disconnect event
    socket.on('disconnect',()=>{
        console.log("user disconnected");
        //6(a)//After disconnect remove user from users[]
        removeUser(socket.id);
        //7 //To see users again 
        io.emit("getUsers",users);
    })
})
