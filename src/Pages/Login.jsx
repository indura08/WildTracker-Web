import React, { useState } from 'react'
import './Login.css'
import backgroundImage from "../assets/tiger3.jpg"
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../redux/userApiCalls'

const Login = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("")
  const [ password , setPassword] = useState("")

  const handleNaviagtion = async (e) => {
    e.preventDefault()

    const loginInfo = { email , password }
    await login(dispatch, loginInfo, navigate)
  }
  
  return (
    <>
      <div class="container-fluid login-container" style={{ backgroundImage: `url(${backgroundImage})` }}>

        <div class="text-dark bg-white form-div d-flex align-items-center justify-content-center border border-success border-5" style={{ width: "50%"}}>
          <div class="px-5 py-5" style={{ width: "100%"}}>
            
            <h3>Login</h3>
            <p>Login to your dashboard</p>


            <form className='mt-3' onSubmit={handleNaviagtion}>
                <div class="mb-3">
                  <label for="exampleInputEmail1" class="form-label">Email address</label>
                  <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div class="mb-3">
                  <label for="exampleInputPassword1" class="form-label">Password</label>
                  <input type="password" class="form-control" id="exampleInputPassword1" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div class="mb-3 form-check">
                  <input type="checkbox" class="form-check-input" id="exampleCheck1"/>
                  <label class="form-check-label" for="exampleCheck1">Remember Me</label>
                  <a href='/forgetPassword'><p style={{fontSize:"12px" , marginTop:"7px"}}>Forget Password</p></a>
                </div>

                <div className='d-flex flex-column'>
                  <button type="submit" class="btn btn-success align-items-center">Login</button>
                </div>

              </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
