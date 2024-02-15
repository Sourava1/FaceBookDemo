import React, { useContext } from 'react'
import "./Post.css"
import {MoreVert} from "@material-ui/icons"
import { useState,useEffect } from 'react';
import axios from "axios";
import {Link} from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';

const Post = ({post}) => {
   
    const [like,setLike] = useState(post.likes.length);
    const [isLiked,setIsLiked] = useState(false)
    const [user,setUser] = useState({});
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const {user:currentUser} = useContext(AuthContext);//here currentUser is like nick nanme of user

    useEffect(()=>{
      setIsLiked(post.likes.includes(currentUser._id));//here includs eturns a boolean value of true or false depending on the result.
    },[currentUser._id,post.likes]);

    useEffect(()=>{
        const fetchUser = async ()=>{
          try {
            const res = await axios.get(`/users?userId=${post.userId}`);
            setUser(res.data);  
          } catch (error){
            console.log(error);
          }
        
        };
        fetchUser();
       
    },[post.userId]);

    const likeHnadler = ()=>{
        try{
          axios.put("/posts/" + post._id+"/like",{userId:currentUser._id});//i passed my current users id
          setLike(isLiked ? like-1 : like+1)
          setIsLiked(!isLiked)
        }catch(err){

        }
    }
  return (
    <div className='post'>
        <div className='postWrapper'>
            <div className='postTop'>
                    <div className='postTopLeft'>
                        <Link to={`profile/${user.username}`}>
                                {/* <img className="postProfileImg" src={Users.filter((u) => u.id === post?.userId)[0].profilePicture} alt=""/> */}
                                <img className='postProfileImg' 
                                src={  user.profilePicture ? PF + user.profilePicture : PF+"noAvatar.jpeg"} 
                                alt=""/>
                        </Link>
                        {/* <span className='postUsername'>{Users.filter((u) => u.id === post?.userId)[0].username}</span> */}
                        <span className='postUsername'>{user.username}</span>
                        <span className='postDate'>{post.date && new Date(post.date).toDateString()}</span>
                    </div>
                    <div className='postTopRight'>
                        <MoreVert/>
                    </div>
            </div>


            <div className='postCenter'>
               <span className='postText'>{post?.desc}</span>
               <img  className="postImg" src={PF+post.img} alt=""/>
            </div>

            <div className='postBottom'>
                <div className='postBottomLeft'>
                    <img className='likeIcon' src={`${PF}like.jpeg`} onClick={likeHnadler} alt=""/>
                    <img className='likeIcon' src={`${PF}heart.jpeg`} onClick={likeHnadler} alt=""/>
                    <span className='postLikeCounter'>{like} people like it</span>
                </div>
                <div className='postBottomRight'>
                    <span className='postCommentText'>{post.comments} comments</span>
                </div>
            </div>
        </div>
        
    </div>
  )
}

export default Post