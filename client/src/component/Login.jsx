import React from 'react'
import { FcGoogle } from "react-icons/fc";

function Login() {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <div class="loginpage">
        <h1 style={{color:"#2c17b3"}}>Login</h1>
      <p>Login Required</p>
      <button onClick={handleGoogleLogin} ><FcGoogle style={{fontSize:"30px"}}/>
        <h3 style={{fontWeight:"700",marginTop:"7px"}}>Login with Google</h3>
      </button>
    </div>
  );
}

export default Login