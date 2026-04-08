const express = require("express")
const router = express.Router();
const User = require("../models/user");

router.get("/",async(req,res)=>{
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page -1)*limit;

        const users = await User.find().sort({createdAt:-1}).skip(skip).limit(limit);

        const total = await User.countDocuments();

        res.status(200).json({users,total});
    }catch (error) {
        console.error("Fetch Users Error", error);
        res.status(500).json({message: "Server Error while fetching users"});
    }
});

router.patch("/:id/soft-delete", async(req,res)=>{
    try{
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {deletedAt: new Date()},
            {new: true}
        );
        if(!user) return res.status(404).json({message : "User not found"});
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({message:"Error durting soft delete"});
    }
});

router.patch("/:id/restore", async(req,res)=>{
    try{
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {deletedAt: null},
            {new:true}
        );
        if(!user) return res.status(404).json({message:"User not found"});
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({message:"Error during restore"});
    }
});

module.exports = router;