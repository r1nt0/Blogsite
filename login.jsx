import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { Link} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import "./Design.css";

function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const Navigate = useNavigate();

  const handleLogin = async (e) => {
   e.preventDefault()
    try {
        axios.post("http://localhost:5000/api/login", {email: email, password: password})
        .then((response) => {
          const data = response.data;
          if(data){
            localStorage.setItem("mytoken", data.token)
            Navigate('/user');
          }
        })
     
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

 
  
  return (
    <div className='LoginPage'>
      <br />
          <form onSubmit={handleLogin}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          <br />
         
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button type='submit'>login</button>
            </form>
              <b>New user? </b>
            <Link to="/signup"><b>Sign Up</b></Link>
          
    </div>
  )
}

export default LoginPage