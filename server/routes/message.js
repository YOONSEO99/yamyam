const express = require('express');
const router = express.Router();
const Message = require('../models/message');

router.get('/:lessonId', async(req,res)=>{
    try{
        const {lessonId} = req.params;

        const messages = await Message.find({lessonId}).populate('senderId','nickname avatarUrl').sort({createdAt:1});

        res.status(200).json(messages);

    }catch(error){
        res.status(500).json({message:'Error fetching messages', error});
    }
});

router.post('/',async(req, res)=>{
    try{
        const {lessonId, senderId,receiverId, content} = req.body;
        const newMessage = new Message({
            lessonId,
            senderId,
            receiverId,
            content
        });

        const savedMessage = await newMessage.save();
        const populatedMessage = await Message.findById(savedMessage._id).populate('senderId','nickname avatarUrl');

        res.status(201).json(populatedMessage);

    }catch(error){
        res.status(500).json({message: 'Error sending message', error});
    }
});

module.exports = router;