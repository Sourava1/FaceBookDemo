import "./Message.css"
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {format} from "timeago.js"

const Message = ({message,own}) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user } = useContext(AuthContext);
  return (
    <div className={own ? "message  own" : "message"}>
        <div className="messageTop">
            <img  className="messageImg" src={ user.profilePicture ? PF+user.profilePicture : PF+"noAvatar.jpeg"} alt="" />
            <p className="messageText">{message.text}</p>
        </div>
        <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  )
}

export default Message