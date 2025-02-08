const express = require("express");
const { verifyToken, verifyTokenAndAutherization, verifyTokenAndAdmin } = require("./VerifyToken");
const route = express.Router();
const User = require("../Models/User");

route.delete("/delete/:id", verifyTokenAndAutherization, async (req,res) => {
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted successfully")
    }catch(err){

        res.status(500).json(err)
    }
})

route.put("/:id", verifyToken, async (req,res) => {
    if(req.body.password){
        req.body.password = CryptoJs.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()
    }

    try{
        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true}
        );
        res.status(200).json(updateUser);
    }catch(err){
        res.status(500).json(err)
    }
})

//ps: delete and putmethod deka withri damme danata , get method damme nha e tika damu passe

module.exports = route;