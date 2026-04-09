const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  lessonId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson', 
    required: true  
  },
  senderId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true
  },
  receiverId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true
  },
  content:{
    type:String,
    required:true
  },
  
  isRead: { 
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Message', messageSchema);