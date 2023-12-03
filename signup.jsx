import React from 'react'
import { useState } from 'react';
import axios from 'axios'

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitButton = () => {
    
    axios.post("http://localhost:5000/api/signup", {
      email: email,
      password: password
  })

    .then(() => {
      setPassword("");
      setEmail("");
    })
    .catch((error) => {
      alert(error);
    });
  
};
  return (
    <div>SignupPage
      <br />
      
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          
         
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={submitButton}>Register</button>
          
    </div>
  )
}

export default SignupPage