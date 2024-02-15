import React, { useEffect, useState } from 'react'
import "./Rightbar.css"
import { Users } from '../../dummyData'
import Online from '../online/Online'
import axios from "axios"
import {Link} from "react-router-dom";
import { Add, Remove } from '@material-ui/icons';
import { useContext } from 'react'
import {AuthContext} from "../../context/AuthContext";

const Rightbar = ({user}) => {

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends,setFriends] = useState([]);
  const {user:currentUser,dispatch} = useContext(AuthContext);
  //Hook for follow and unfollow user
  const [followed,setFollowed] = useState(currentUser.following.includes(user?.id))
  // useEffect(()=>{
  //     //currentUser.following.includes(user?.id)
  //     setFollowed(currentUser.following.includes(user?.id));
  // },[currentUser,user]);
  
  useEffect(()=>{
    const getFriends = async () => {
      try{
         // Check if user is defined before making the API call
      if (user?._id) {
        const friendList = await axios.get("/users/friends/" + user._id);
        setFriends(friendList.data);
      }
      // const friendList = await axios.get("/users/friends/" + user._id);
      // setFriends(friendList.data);
      }catch(err){
        console.log(err);
      }
    }
    getFriends();
  },[user]);

  const handleClick = async() => {
    try{
        //if you Allready follow this user unfollow 
        //and if you are not following this user it would be follow and when we click this we should make reques for this follow
        if(followed){
          await axios.put("/users/" +user._id+"/unfollow",{userId: currentUser._id});
          dispatch({type:"UNFOLLOW",payload:user._id})
        }else{
          await axios.put("/users/" +user._id+"/follow",{userId: currentUser._id});
          dispatch({type:"FOLLOW",payload:user._id})
        }
    }catch(err){
      console.log(err);
    }

    //after all this setFollowed id opposite of current situation
    setFollowed(!followed)
  };

  const HomeRightbar = () =>{
    return(
      <>
        <div className='birthdayContainer'>
              <img className='birthdayImg' src={`${PF}gift.png`} alt=""/>
              <span className='birthdayText'> 
                  <b>Sourav</b>and<b> 3 other friends </b> have a birthday today
              </span>
          </div>
          <img className='rightbarAd' src={`${PF}EBanner.png`} alt=""/>
          <h4 className='rightbarTitle'>Online Friends</h4>
          <ul className='rightbarFriendList'>
              {Users.map((u)=>(
                <Online  key={u.id} user={u}/>
              ))}
          </ul>
      </>
    );
  };

  const ProfileRightbar = () =>{

    
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    return(
      <>
      {user?.username !== currentUser.username && (
          <button className='rightbarFollowButton' onClick={handleClick}>
            {followed ? "unfollow" : "follow"}
            {followed ? <Remove/> : <Add/>}
          </button>
      )}
       {/* {user?.username !== currentUser.username && (
          <button className={`rightbarFollowButton ${followed ? 'following' : ''}`} onClick={handleClick}>
            {followed ? "Following" : "follow"}
            {followed ? <Remove/> : <Add/>}
          </button>
      )} */}
        <h4 className='rightbarTitle'>User Information</h4>
        <div className='rightbarInfo'>
            <div className='rightbarInfoItem'>
                <span className='rightbarInfoKey'>City:</span>
                <span className='rightbarInfoValue'>{user?.city}</span>
            </div>
            <div className='rightbarInfoItem'>
                <span className='rightbarInfoKey'>From:</span>
                <span className='rightbarInfoValue'>{user?.from}</span>
            </div>
            <div className='rightbarInfoItem'>
                <span className='rightbarInfoKey'>Relationship:</span>
                <span className='rightbarInfoValue'>{user?.relationship ===1 ?"Single" : user.relationship ===2 ?"Married" : "-" }</span>
            </div>
        </div>
        
        <h4 className='rightbarTitle'>User friends</h4>

        <div className='rightbarFollowings'>
            {friends.map((friend) =>(
              <Link to={"/profile/" + friend.username} style={{textDecoration:"none"}} key={friend._id}>
                <div className='rightbarFollowing'>
                    <img src={friend.profilePicture ? PF+friend.profilePicture : PF+"noAvatar.jpeg"} alt="" className='rightbarFollowingImg'/>
                    <span className='rightbarFollowingName'>{friend.username}</span>
                </div> 
              </Link>
           ))}
             
        </div>
      </>
    )
  }
  return (
    <div className='rightbar'>
       <div className='rightbarWrapper'>
          {user? <ProfileRightbar/> : <HomeRightbar/>}
       </div>
    </div>
  )
}

export default Rightbar