import React, { useContext,useEffect,useState } from 'react'
import "./Feed.css"
import Share from '../share/Share'
import Post from '../post/Post'
import axios from "axios";
import { AuthContext } from '../../context/AuthContext';


export default function Feed({username}){
  
  const [posts,setPosts] = useState([]);
  //here i fetch crrent user
  const {user} = useContext(AuthContext);
  useEffect(()=>{
    const fetchPosts = async()=>{
      try {
        const res =username
        ? await axios.get("/posts/profile/" + username)
        : await axios.get(`/posts/timeline/${user._id}`);
        setPosts(res.data.sort((p1,p2) =>
          new Date(p2.createdAt) - new Date(p1.createdAt)
        ));
        console.log(res.data);
      } catch (error){
        console.log(error);
      }
    };
    fetchPosts();
  },[username,user._id]);
  
  return (
    <div className='feed'>
      <div className='feedWrapper'>
          {( !username || username === user.username)  && <Share/>}
          {posts.map((p)=>(
              <Post key={p._id} post={p}/>
          ))}
          
      </div>
    </div>
  );
}

