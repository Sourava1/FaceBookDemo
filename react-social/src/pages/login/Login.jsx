import "./Login.css"
import { useRef,useContext} from 'react';
import { loginCall } from '../../apiCalls';
import { AuthContext } from '../../context/AuthContext';
import {CircularProgress} from "@material-ui/core"

const Login = () => {
    //To create a ref, call useRef with an initial value: const ref = useRef(initialValue).
    const email = useRef();
    const password = useRef();
    // const {user,isFetching,dispatch} = useContext(AuthContext);
    const {isFetching,dispatch} = useContext(AuthContext);
    
    const handleClick = (e) =>{
        e.preventDefault();//To not Refresh This page
        loginCall({email:email.current.value,password:password.current.value},dispatch);
    }
  return (
    <>
        <div className='login'>
            <div className='loginWrapper'>
                <div className='loginLeft'>
                    <h3 className='loginlogo'>FaceBook</h3>
                    <span className='loginDesc'>Connect with friends and the world around you on FaceBook</span>
                </div>
                <div className='loginRight'>
                    <form className='loginBox' onSubmit={handleClick}>
                        <input placeholder='Email' type='email' required className='loginInput' ref={email}/>
                        <input placeholder='Password' type='password' className='loginInput' minLength={6} maxLength={12} ref={password}/>
                        <button className='loginButton' type='submit' disabled={isFetching}>{isFetching ? <CircularProgress color="white" size="20px"/> : "Log In"}</button>
                        <span className='loginForgot'> Forgot Password?</span>
                        <button className='loginRegistrationButton'>{isFetching ? <CircularProgress color="white" size="20px"/> : "Create New Account"}</button>
                    </form>
                </div>
            </div>
        </div>
    </>
  )
}

export default Login