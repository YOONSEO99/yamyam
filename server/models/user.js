const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,   
    trim: true      
  },
  password: { 
    type: String, 
    required: true  
  },
  firstName: { 
    type: String, 
    required: true 
  },
  lastName: { 
    type: String, 
    required: true 
  },
  birthDate: { 
    type: String,   
    required: true 
  },
  
  nickname: { 
    type: String 
  },
  avatarUrl: { 
    type: String   
  },
  bio: { 
    type: String    
  },
  isInstructor: { 
    type: Boolean, 
    default: false  
  },
  isAdmin: { 
    type: Boolean, 
    default: false  
  },
  role: { 
    type: String, 
    default: 'user' 
  },
  favoriteLessonIds: [{ 
    type: String    
  }],
  deletedAt: { 
    type: Date,     
    default: null   
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('User', userSchema);