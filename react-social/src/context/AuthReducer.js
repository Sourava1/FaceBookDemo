const AuthReducer = (state, action) => {
    switch (action.type) {
      case "LOGIN_START":
        return {
          user: null,
          isFetching: true,
          error: false,
        };
      case "LOGIN_SUCCESS":
        return {
          user: action.payload,
          isFetching: false,
          error: false,
        };
      case "LOGIN_FAILURE": 
        return {
          user: null,
          isFetching: false,
          error:true,
          //error: action.payload,
        };
        case "FOLLOW": 
        return {
          ...state,
          user: {
            ...state.user,
            followings: [...state.user.following,action.payload],//i think this is also correct if any error happen change this also
            //following: [...state.user.following,action.payload],
          }
        };
        case "UNFOLLOW": 
        return {
          ...state,
          user: {
            ...state.user,
            followings: state.user.following.filter((following) => following !== action.payload),//i think this is also correct if any error happen change this also
            //following: state.user.following.filter((following) => following !== action.payload),
          },
        };
        case "LOGOUT":
          return {
            user: null,
            isFetching: false,
            error: false,
          };
      default:
        return state;
    }
  };
  
  export default AuthReducer;
  