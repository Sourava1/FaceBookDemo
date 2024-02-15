import { createContext, useReducer ,useEffect} from "react";
import AuthReducer from "./AuthReducer";
const INITIAL_STATE = {
  // user:{
  //   _id:"65a91466aa27eb93b3bf7553",
  //   username:"Anil",
  //   email:"Anil@gmail.com",
  //   profilePicture:"/anil.jpg",
  //   coverPicture:"anilbanner1.png",
  //   followers:[],
  //   following:[],
  // },
  //user: null,
  user:JSON.parse(localStorage.getItem("user")) || null,
  isFetching: false,
  error: false,
};



export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(()=>{
    localStorage.setItem("user", JSON.stringify(state.user))
  },[state.user]);

  //pareeeee
  // const logout = () => {
  //   dispatch({ type: "LOGOUT" });
  //   // Clear local storage
  //   localStorage.removeItem("user");
  // };

  return (

    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
        //logout,//pare
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
