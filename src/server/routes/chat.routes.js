
const express = require('express');
const Message = require('../models/message.model');
const User = require('../models/user.model');
const auth = require('../middleware/auth');
const router = express.Router();

// Get direct messages with a user
router.get('/direct/:userId', auth, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Verify users are friends
    const user = await User.findById(req.user.id);
    if (!user.friends.includes(userId)) {
      return res.status(403).json({ message: 'You are not friends with this user' });
    }
    
    // Get messages between the two users
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id }
      ]
    })
    .populate('sender', 'username avatar')
    .populate('receiver', 'username avatar')
    .sort({ createdAt: 1 });
    
    // Mark messages as read
    await Message.updateMany(
      { sender: userId, receiver: req.user.id, readBy: { $ne: req.user.id } },
      { $push: { readBy: req.user.id } }
    );
    
    res.json(messages);
  } catch (error) {
    console.error('Get direct messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recent conversations
router.get('/conversations', auth, async (req, res) => {
  try {
    // Get user's friends
    const user = await User.findById(req.user.id)
      .populate('friends', 'username avatar status');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // For each friend, get the most recent message
    const conversations = await Promise.all(
      user.friends.map(async (friend) => {
        const lastMessage = await Message.findOne({
          $or: [
            { sender: req.user.id, receiver: friend._id },
            { sender: friend._id, receiver: req.user.id }
          ]
        })
        .sort({ createdAt: -1 })
        .limit(1);
        
        // Count unread messages
        const unreadCount = await Message.countDocuments({
          sender: friend._id,
          receiver: req.user.id,
          readBy: { $ne: req.user.id }
        });
        
        return {
          id: friend._id,
          username: friend.username,
          avatar: friend.avatar,
          status: friend.status,
          lastMessage: lastMessage || null,
          unreadCount
        };
      })
    );
    
    // Sort by most recent message
    conversations.sort((a, b) => {
      const dateA = a.lastMessage ? new Date(a.lastMessage.createdAt) : new Date(0);
      const dateB = b.lastMessage ? new Date(b.lastMessage.createdAt) : new Date(0);
      return dateB - dateA;
    });
    
    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
