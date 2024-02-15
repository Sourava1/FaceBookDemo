import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Home from "./pages/home/Home";
import Register from "./pages/register/Register";
import Profile from "./pages/profile/Profile";
import Login from "./pages/login/Login";
import Messenger from "./pages/messenger/Messenger";
function App() {
  const { user } = useContext(AuthContext);
  return (
    <>
      <Router>
        <Routes>
          {/* This route is set up to display the Home component if there is a user and the Register component if there is no user. */}
          <Route path="/" element={user? <Home /> : <Register/>} />
          {/* This route is set up to navigate to the home page (/) if there is a user and to display the Login component if there is no user. */}
          <Route path="/login" element={user? <Navigate to="/" /> : <Login/>} />
          {/* if there is a user you can't go to register page*/}
          <Route path="/register" element={user? <Navigate to="/"/> : <Register/>} />
          <Route path="/messenger" element={!user?  <Navigate to="/"/> : <Messenger/>} />
          <Route path="/profile/:username" element={<Profile />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
