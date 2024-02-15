import React, { useContext, useRef ,useState} from 'react'
import "./Share.css"
import {PermMedia,Label,Room,EmojiEmotions,Cancel} from "@material-ui/icons"
import {AuthContext} from "../../context/AuthContext";
import axios from "axios";
const Share = () => {
    const {user} = useContext(AuthContext)
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const desc = useRef();
    const [file,setFile] = useState(null);

    //When the form is submitted, the submitHandler function creates a new post object (newPost) with user information and the entered description. If there's a file selected, it uses axios.post("/upload", data) to upload the file to the server.
    const submitHandler = async (e) => {
        e.preventDefault();

        //here we create new post
        const newPost = {
            userId: user._id,
            desc: desc.current.value
        };
        if(file){
            const data = new FormData();
            
            //const filename = Date.now() + file.name;//this is used to avoid file conflit suppose there are 2 user use same name of like like.png
            //inside this i can push my properties
            data.append("file",file);
            // data.append("name",filename);
           // newPost.img = filename;//so for this image  indicate my filpath named filename here img is mongodb schema Attribute
            try{
                const response = await axios.post("/upload",data);
                console.log(response.data);
                newPost.img = response.data;

            }catch(err){
                console.log(err);
            }
        }


        try{
          await  axios.post("/posts",newPost);
          window.location.reload();
        }catch(err){
            console.log(err);
        }
    }

  return (
    <div className='share'>

        <div className='shareWrapper'>
            <div className='shareTop'>
                <img className='shareProfileImg' src={user.profilePicture ? PF + user.profilePicture : PF +"noAvatar.jpeg" } alt="Profile"/>
                <input placeholder= {"what's in your mind " + user.username + "?"} className='shareInput' ref={desc}/>
            </div>

            <hr className='shareHr'/>

            {/* for showing image on the share which is present below the topbar */}
            {/*{file && } indicates that if there is a file create a div*/}
            {file && (
                <div className='shareImgContainer'>
                    <img className="shareImg" src={URL.createObjectURL(file)} alt=""/>
                    <Cancel className='shareCancelImg' onClick={() => {setFile(null)}}/>
                </div>
            ) }

            <form className='shareBottom' onSubmit={submitHandler}>

                <div className='shareOptions'>
                    <label htmlFor='file' className='shareOption'>
                        <PermMedia htmlColor='tomato' className='shareIcon'/>
                        <span className='shareOptionText'>Photo or Video</span>
                        <input type="file" style={{display:"none"}} id="file" accept=".png, .jpeg, .jpg, .gif, .mp4, .webm, .ogg" onChange={(e) => {
                            setFile(e.target.files[0]);
                        }}/>

                    </label>

                    <div className='shareOption'>
                        <Label  htmlColor='blue' className='shareIcon'/>
                        <span className='shareOptionText'>Tag</span>
                    </div>
                    <div className='shareOption'>
                        <Room  htmlColor='green' className='shareIcon'/>
                        <span className='shareOptionText'>Location</span>
                    </div>
                    <div className='shareOption'>
                        <EmojiEmotions   htmlColor='goldenrod' className='shareIcon'/>
                        <span className='shareOptionText'>Feelings</span>
                    </div>
                    
                </div>

                <div>
                    <button className='shareButton' type='submit'>Share</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Share