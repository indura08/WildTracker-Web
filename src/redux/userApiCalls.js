import axios from "axios"
import { loginstart, loginFailure, loginSuccess } from "./uselSlice"
import { useNavigate } from "react-router-dom"

export const login = async(dispatch, loginInfo, navigate) => {
    dispatch(loginstart())

    try{
        const res = await axios.post("http://localhost:5000/api/auth/login" , loginInfo);

        console.log(res.data)
        navigate("/dashboard")
        dispatch(loginSuccess(res.data));
    }catch(err){
        dispatch(loginFailure());
    }

};