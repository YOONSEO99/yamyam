const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const User = require('../models/user');     
const Lesson = require('../models/lesson');

const { default: mongoose } = require('mongoose');

router.get('/:lessonId', async (req, res) => {
    try {
        const { lessonId } = req.params;
        const currentUserId = req.query.userId;

        const messages = await Message.find({
            lessonId,
            $or: [
                { senderId: currentUserId },
                { receiverId: currentUserId }
            ]
        }).populate('senderId', 'nickname avatarUrl').sort({ createdAt: 1 });

        res.status(200).json(messages);

    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error });
    }
});

router.post('/', async (req, res) => {
    try {
        const { lessonId, senderId, receiverId, content } = req.body;
        const newMessage = new Message({
            lessonId,
            senderId,
            receiverId,
            content
        });

        const savedMessage = await newMessage.save();
        const populatedMessage = await Message.findById(savedMessage._id).populate('senderId', 'nickname avatarUrl');

        res.status(201).json(populatedMessage);

    } catch (error) {
        res.status(500).json({ message: 'Error sending message', error });
    }
});

router.get('/instructor/:instructorId/threads', async (req, res) => {
    try {
        const { instructorId } = req.params;
        const instId = new mongoose.Types.ObjectId(instructorId);

        const threads = await Message.aggregate([
            {
                $match: {
                    $or: [{ senderId: instId }, { receiverId: instId }]
                }
            },
            { $sort: { createdAt: -1 } },
            {
                $addFields: {
                    studentId: {
                        $cond: [{ $eq: ["$senderId", instId] }, "$receiverId", "$senderId"]
                    }
                }
            },
            {
                $match: { 
                  studentId: { $ne: instId } 
                }
              },
            {
                $group: {
                    _id: { student: "$studentId", lesson: "$lessonId" },
                    lastMessage: { $first: "$content" },
                    updatedAt: { $first: "$createdAt" },
                    studentId: { $first: "$studentId" },
                    lessonId: { $first: "$lessonId" }
                }
            },
            { $sort: { updatedAt: -1 } }
        ]);

        const populatedWithStudent = await User.populate(threads, { path: 'studentId', select: 'nickname email' });
        const finalThreads = await Lesson.populate(populatedWithStudent, { path: 'lessonId', select: 'title' });

        const formatted = finalThreads.map(t => ({
            _id: t.studentId._id,      
            student: t.studentId,      
            lesson: t.lessonId,       
            lastMessage: t.lastMessage,
            updatedAt: t.updatedAt
        }));

        res.json(formatted);

    } catch (err) {
        console.log('Error fetching threads:', err);
        res.status(500).json({ message: "Failed to load instructor threads" });
    }
});

// 1. 내가 받은 '안 읽은' 전체 메시지 개수 가져오기
router.get('/unread-count/:userId', async (req, res) => {
    try {
      const count = await Message.countDocuments({ 
        receiverId: req.params.userId, 
        isRead: false 
      });
      res.json({ count });
    } catch (err) {
      res.status(500).json({ message: "Count error", err });
    }
  });
  
  // 2. 채팅방 입장 시 해당 대화들 '읽음'으로 한꺼번에 업데이트
  router.put('/read-all', async (req, res) => {
    try {
      const { lessonId, userId } = req.body;
      await Message.updateMany(
        { lessonId, receiverId: userId, isRead: false },
        { $set: { isRead: true } }
      );
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;