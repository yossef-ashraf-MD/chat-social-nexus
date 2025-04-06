
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'image', 'voice', 'video'],
    default: 'text'
  },
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Message must have either a receiver or room, not both
messageSchema.pre('save', function(next) {
  if ((this.receiver && this.room) || (!this.receiver && !this.room)) {
    next(new Error('Message must have either a receiver or room, not both or neither'));
  } else {
    next();
  }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
