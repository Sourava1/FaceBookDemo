import React, { useEffect,useState } from 'react';
import "./Conversations.css";
import axios from "axios"
const PF = process.env.REACT_APP_PUBLIC_FOLDER;

const Conversations = ({Conv,currentUser}) => {//Access Conv props from Messenger.jsx
  const [user,setUser] = useState(null);

  useEffect(()=>{
     const friendId = Conv.members.find((m) => m !== currentUser._id);

     const getUser = async () =>{
      try{
        const res = await axios("/users?userId=" + friendId);//This is Diffcult because use Find User method which is define in Thunder Client
        
        console.log(res.data);
        setUser(res.data);
      }catch(err){
        console.log(err);
      }
     };
     getUser();
  },[currentUser,Conv]);//when our currentUsers and conversation(Conv) changes this useEffect will run
  return (
    <div className='conversation'>
      {/* <img className='conversationImg' src={PF + "sourav.jpg"} alt="" /> */}
      {user &&(
        <>
            <img className='conversationImg' 
            src={
                  user?.profilePicture 
                    ? PF+user.profilePicture
                    : PF+"noAvatar.jpeg"
              } alt="" />
            <span className='conversationName'>{user.username}</span>
        </>
      )}
    </div>
  );
}

export default Conversations;
