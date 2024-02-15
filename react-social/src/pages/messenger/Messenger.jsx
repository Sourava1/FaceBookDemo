import React, { useContext } from 'react'
import "./Messenger.css"
import Topbar from '../../components/topbar/Topbar'
import Conversations from '../../components/conversations/Conversations'
import Message from '../../components/message/Message'
import ChatOnline from '../../components/chatOnline/ChatOnline'
import { AuthContext } from '../../context/AuthContext'
import { useEffect,useState } from 'react'
import axios from "axios"
import { useRef } from 'react';
import { io } from "socket.io-client";

const Messenger = () => {
  const [conversations,setConversations] = useState([]);
  const [currentChat,setCurrentChat] = useState(null);//here currentchat indicates the left side of chat bar in which all user present
  const [messages,setMessages] = useState([]);
  const [newMessage,setNewMessage] = useState("");//this is for textarea in which user will enter the text for chat
  //12
  const [arrivalMessage,setArrivalMessage] = useState(null);
  //after sending a message we can't see automatically after scrolling it shows to us,so how we gonna scrolll Automatically ?(To do that we have to use reference for each messages)//so whenver we add  new one it scroll automatically
  const [onlineUsers,setOnlineUsers] =useState([]);//this use State is used for showing online users on the right section(right container) of the messenger container//and we will get online user by output of socket which is described in 2 and 4
  const scrollRef = useRef();
  const socket = useRef();
  //fetch current user using login process
  const {user} = useContext(AuthContext);

  //Messenger = () refreshes everytime it assigns useRef( io("ws://localhost:8900")); again so to avoid it we should use useEffect
  useEffect(()=>{
    socket.current = io("ws://localhost:8900");
    //11
    socket.current.on("getMessage",data => {
      //13
        setArrivalMessage({
          sender: data.senderId,
          text:data.text,
          createdAt:Date.now(),
        })
    })
  },[]);//run this just once 

  //if there any changes in arrivalmessages we will update our messages
  useEffect(()=>{
    //14
    arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) &&
    // setMessages([...messages,arrivalMessage])
    setMessages((prev) => [...prev,arrivalMessage])
  },[arrivalMessage,currentChat])

  useEffect(()=>{
    console.log(user);//ti shows current users all detail
   //2 //send event to server (as a result they can store userId and socketId)
    socket.current.emit("addUser",user._id);
    //4(receive)//to taking from(users[])socket server
    socket.current.on("getUsers",(users)=>{
      console.log(users);
      setOnlineUsers(user.following.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [user]);//because user can change

  //when i try to refresh this page it gonna try fetch all the conversation of current user
  useEffect(()=> {
      const getConversations = async()=>{
        try{
          const res = await axios.get("/conversation/"+ user._id);
          //instead of console.log(res.data) write setConversations
          console.log(res.data);
          setConversations(res.data);
        }catch(err){
          console.log(err);
        }
      }
      getConversations();
  },[user._id])
  // console.log(currentChat);

  useEffect(()=>{
    const getMessages = async () =>{
      try{
        const res =await axios.get("/messages/" + currentChat?._id);
        setMessages(res.data);
      }catch(err){
        console.log(err);
      }
    };

    getMessages();
  },[currentChat]);//i use currentchat here because whenever it changes it gonna fire this useEffect 

  console.log("my messages are" + messages);

  const handleSubmit = async(e)=>{
    e.preventDefault();
    const message = {
        sender: user._id,
        text:newMessage,
        conversationId: currentChat._id//here currentChat defines the left side of chatbar there show all users
    }
    //now after this we to sent this message 
    try{
        const res = await axios.post("/messages",message);
        setMessages([...messages,res.data])//...messages will show all previous messages other it will update to current messages
        setNewMessage(" ");//to make textArea Empty
    }catch(err){
      console.log(err);
    }
    //suppose i chating with saswat then i have to find find it's id in members there are 2 id or more ,so for finding receiver id i have to apply condition like if members not equal to my id then take it as receiver id
    const receiverId = currentChat.members.find(member => member !==user._id)
    //10(a)//sending message/customEvent to the server from client side//socket.emit('custom event",{data:'customData'})
    socket.current.emit("sendMessage",{
      //check in socket server 📁 what you are sending in sendMessage event
      senderId:user._id,
      receiverId,//for getting receiverId we explain above(before 10(a)) on how to get receiverId
      text: newMessage,
    })

  };


  useEffect(()=>{
      scrollRef.current?.scrollIntoView({behaviour:"smooth"})//scrollIntoView() is a method which scroll to end of the div//if i not write {behaviour:"smooth"} there it will make it fast
  },[messages])//whenever messages change we should fire this useEffect

  return (
    <>
      <Topbar/>
      <div className='messenger'>
        {/* //***************************1ST SECTION ************************************ */ }

          <div className='chatMenu'>
              <div className='chatMenuWrapper'>
                <input placeholder='Search for friends' className='chatMenuInput'/>
                {conversations.map((c)=>(
                  //for ezch chat i make  a div
                    <div onClick={() => setCurrentChat(c)}>
                        <Conversations key={c._id} Conv={c} currentUser={user}/>
                    </div>
                    ))}
              </div>
          </div>

        {/* //***************************2ND SECTION ************************************ */ }

          <div className='chatBox'>
            <div className='chatBoxWrapper'>
              {
                currentChat ?(
                  <>
                  <div className='chatBoxTop'>
                      {/* <Message/>
                      <Message own={true}/>
                      <Message/>
                      <Message own/>
                      <Message own/> */}
                      {messages.map(m =>(//for each messages we use below component
                            <div ref={scrollRef}>
                                <Message message={m} own={m.sender === user._id}/>
                            </div>
                    ))}
                  </div>
                  <div className='chatBoxBottom'>
                        <textarea className='chatMessageInput' placeholder='write something...' onChange={(e) => setNewMessage(e.target.value)} value={newMessage}></textarea>
                        <button className='chatSubmitButton' onClick={handleSubmit}>Send</button>
                  </div>
                </> 
                )
                : (<span className="noConversationText">Open a conversation to start a chat</span>)
                }
            </div>
          </div>


          {/* //***************************3RD SECTION ************************************ */ }
          <div className='chatOnline'>
            <div className='chatOnlineWrapper'>
                {/* why we sent currentId={user._id} on ChatOnline user ?bcz we have to show there only on online friend not current user so for filtering current user needed so it passed as prop */}
              <ChatOnline onlineUsers={onlineUsers} currentId={user._id}  setCurrentChat={setCurrentChat}/>
            </div>
          </div>
      </div>
    </>
  )
}

export default Messenger