const express = require("express")
const route = express.Router()

const CryptoJs = require("crypto-js")
const User = require("../Models/User")
const jwt = require("jsonwebtoken")

route.post("/register", async (req,res) => {
    const newUser = new User({
        username: req.body.username,
        email:req.body.email,
        password: CryptoJs.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()
    })

    try{
        const savedUser = await newUser.save();
        res.status(200).json({states: "Successfull", savedUser:savedUser})
    }catch(err){
        res.status(500).json({err:err})
    }
})

route.post("/login", async (req,res) => {
    try{
        const user = await User.findOne({email: req.body.email})
        console.log(user)

        if(!user){
            return res.status(401).json({message:"Wrong crednetials"})
        }

        const hashedPassword = CryptoJs.AES.decrypt(user.password , process.env.PASS_SEC);

        const originalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);

        const accessToken = jwt.sign({
            id:user._id,
            email:user.email
        }, process.env.JWT_SEC, {expiresIn: "18d"})

        if(originalPassword !== req.body.password){
            console.log("for  debugging prposes only")
            return res.status(401).json("Wrong credentials, check again")
        }

        const {password, ...other} = user._doc;

        return res.status(200).json({...other, accessToken, "status": "login successfull"})
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = route;