import { createSlice } from "@reduxjs/toolkit"

const savedUser = localStorage.getItem("user")
const token = localStorage.getItem("token")

const initialState = {
    currentUser : savedUser ? JSON.parse(savedUser) : {
        _id: "0",
        username: "",
        password: "",
        email:""
    },
    isFetching: false,
    error: false,
    token : token ? token : ""
}

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers: {
        loginstart: (state) => {
            state.isFetching = true;
        },
        loginSuccess: (state,action) => {
            state.isFetching = false,
            state.currentUser = action.payload.user;
            state.token = action.payload.response.token

            localStorage.setItem("user", JSON.stringify(state.currentUser));
            localStorage.setItem("token", state.token);
        },
        loginFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        logout: (state) => {
            state.currentUser = initialState.currentUser;
            state.token = initialState.token;

            localStorage.removeItem("user");
            localStorage.removeItem("token");
        }
    }
})

export const { loginstart, loginSuccess, loginFailure, logout} = userSlice.actions;

export default  userSlice.reducer;