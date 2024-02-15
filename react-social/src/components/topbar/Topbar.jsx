import "./Topbar.css"
import { Search,Person,Chat,Notifications} from '@material-ui/icons';
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Topbar = () => {
    //choosing my current user
    const {user} = useContext(AuthContext);
    //For using public folder
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <div className="topbarContainer">
        <div className="topbarLeft">
            <Link to="/" style={{textDecoration:"none"}}>
                <span className="logo">FaceBook</span>
            </Link>
        </div>


        <div className="topbarCenter">
            <div className="searchbar">
                <Search className="searchIcon"/>
                <input placeholder="Search for friend,post or video" className="searchInput"/>
            </div>
        </div>


        <div className="topbarRight">
          <div className="topbarLinks">
              <span className="topbarLink">Homepage</span>
              <span className="topbarLink">Timeline</span>
          </div>

          <div className="topbarIcons">
              <div className="topbarIconItems">
                  <Person/>
                  <span className="topbarIconBadge">1</span>
              </div>
              <div className="topbarIconItems">
                  <Chat/>
                  <span className="topbarIconBadge">1</span>
              </div>
              <div className="topbarIconItems">
                  <Notifications/>
                  <span className="topbarIconBadge">1</span>
              </div>
          </div>
          {/* so when i click on profile,i have to go profile page for this i use Link here */}
            <Link to={`/profile/${user.username}`}>
                <img src={ user.profilePicture ? PF+user.profilePicture : PF+"noAvatar.jpeg"} alt="" className="topbarImg"/>
            </Link>
        </div>
    </div>
  )
}

export default Topbar;