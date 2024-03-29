import React from 'react'
import "./Online.css"



const Online = ({user}) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <div>
        <li className='rightbarFriend'>
                <div className='rightbarProfileContainer'>
                    <img className='rightbarProfileImg' src={PF+user.profilePicture} alt=""/>
                    <span className='rightbarOnline'></span>
                </div>
                <span className='rightbarUsername'>{user.username}</span>
            </li>
    </div>
  )
}

export default Online