
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&h=400&auto=format&fit=crop'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
