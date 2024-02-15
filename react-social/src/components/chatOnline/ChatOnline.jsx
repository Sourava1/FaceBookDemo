import { useEffect, useState } from "react";
import "./ChatOnline.css"
import axios from "axios"
   

const ChatOnline = ({onlineUsers,currentId,setCurrentChat}) => {

  const [friends,setfriends] = useState([]);
  const [onlineFriends,setOnlineFriends] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(()=>{
        const getFriends = async()=>{
          const res = await axios.get("/users/friends/" + currentId);
          setfriends(res.data);
        };
        getFriends();
  },[currentId]);

  console.log(friends);

  useEffect(()=>{
      //here f is all my friends that i following it all get from friends ,,again it filter out that current;y which friends are online
      setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
  },[friends, onlineUsers]);


  const handleClick = async (user) => {
    console.log("hiii");
    try {
      const res = await axios.get(
        `/conversation/find/${currentId}/${user._id}`
      );
      setCurrentChat(res.data);
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <div className="chatOnline">
            {onlineFriends.map((o)=>(
              <div key={o._id} className="chatOnlineFriend" onClick={() => handleClick(o)}>
              <div className="chatOnlineImgContainer">
              <img className="chatOnlineImg" 
               src={o?.profilePicture 
                ? PF+o.profilePicture 
                : PF+"noAvatar.jpeg" }
                alt=""/>
                <div className="chatOnlineBadge"></div>
              </div>
              <span className="chatOnlineName">{o?.username}</span>
          </div>  
      ))}
          
    </div>
  );
}

export default ChatOnline