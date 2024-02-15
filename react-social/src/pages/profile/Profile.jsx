import React from "react";
import "./Profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useState,useEffect } from "react";
import axios from "axios";
import {useParams} from "react-router";
const Profile = () => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user,setUser] = useState({});
  const name = useParams();
  const username = name.username;//Here username is comes from App.jsx path that is http://localhost:3000/profile/sonu or <Route path="/profile/:username" element={<Profile/>}/>
  console.log(username);//sonu

  useEffect(()=>{
    const fetchUser = async ()=>{
      try {
        const res = await axios.get(`/users?username=${username}`);
        setUser(res.data);  
        console.log(res.data);
      } catch (error){
        console.log(error);
      }
    
    };
    fetchUser();
   
},[username]);
  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
            {user.coverPicture ?(
                  <img className="profileCoverImg" src={PF + user.coverPicture} alt="" /> 
            ) : (
              
              <video className="profileCoverImg" autoPlay loop muted>
                   <source src={ PF + "noCover.mp4" } type="video/mp4" />
                 </video>
            )};
                
                <img className="profileUserImg" src={user.profilePicture ?PF + user.profilePicture : PF+"noAvatar.jpeg"} alt=""/>
            </div>
            <div className="profileInfo">
                <h4 className="profileInfoName">{user.username}</h4>
                <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username}/>
            <Rightbar  user={user} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
