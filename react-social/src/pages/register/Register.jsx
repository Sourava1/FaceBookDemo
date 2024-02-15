import React from 'react'
import "./Register.css"
import { useRef } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const Register = () => {
    const username = useRef();
    const email = useRef();
    const password = useRef();
    const passwordAgain = useRef();
    const navigate  = useNavigate();//i can redirect to previous pages and any other pages
     

    const handleClick = async (e) =>{
        e.preventDefault();
        if(passwordAgain.current.value !== password.current.value){
            passwordAgain.current.setCustomValidity("Passwords Don't match!");//if you write password instead of passwordAgain then notification will show on password placeholder
        }else{
            const user = {
                username:username.current.value,
                email:email.current.value,
                password:password.current.value,

            }
            try{
                await axios.post("/auth/register",user);
                // if everything is ok i'm going to redirect to login page so for this i have to use useHistory Hook
                navigate("/login");
            }catch(err){
                console.log(err);
            }

        }
    }
  return (
    <>
        <div className='Register'>
            <div className='loginWrapper'>
                <div className='loginLeft'>
                    <h3 className='loginlogo'>FaceBook</h3>
                    <span className='loginDesc'>Connect with friends and the world around you on FaceBook</span>
                </div>
                <div className='loginRight'>
                    <form className='loginBox' onSubmit={handleClick}>
                        <input placeholder='Username' required className='loginInput' ref={username}/>
                        <input placeholder='Email' required className='loginInput' type="email" ref={email}/>
                        <input placeholder='Password'  required className='loginInput' type="password" minLength={6} maxLength={12} ref={password}/>
                        <input placeholder='Password Again' required className='loginInput' type="password" minLength={6} maxLength={12} ref={passwordAgain}/>
                        <button className='loginButton' type='submit'>Sign Up</button>

                        <button className='loginRegistrationButton'>Log into Account</button>
                    </form>
                </div>
            </div>
        </div>
    </>
  )
}

export default Register