
const express = require('express');
const User = require('../models/user.model');
const auth = require('../middleware/auth');
const router = express.Router();

// Get authenticated user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('friends', 'username email avatar status');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (except authenticated user)
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } })
      .select('username email avatar status');
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send friend request
router.post('/friend-request/:userId', auth, async (req, res) => {
  try {
    const receiver = await User.findById(req.params.userId);
    
    if (!receiver) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if request already exists
    const existingRequest = receiver.friendRequests.find(
      request => request.sender.toString() === req.user.id
    );
    
    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }
    
    // Check if already friends
    if (receiver.friends.includes(req.user.id)) {
      return res.status(400).json({ message: 'Users are already friends' });
    }
    
    // Add friend request
    receiver.friendRequests.push({ sender: req.user.id });
    await receiver.save();
    
    res.json({ message: 'Friend request sent successfully' });
  } catch (error) {
    console.error('Send friend request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept/reject friend request
router.put('/friend-request/:requestId', auth, async (req, res) => {
  try {
    const { accept } = req.body;
    const user = await User.findById(req.user.id);
    
    // Find the request
    const requestIndex = user.friendRequests.findIndex(
      request => request._id.toString() === req.params.requestId
    );
    
    if (requestIndex === -1) {
      return res.status(404).json({ message: 'Friend request not found' });
    }
    
    const request = user.friendRequests[requestIndex];
    
    if (accept) {
      // Accept friend request
      user.friends.push(request.sender);
      
      // Add the user to sender's friends as well
      await User.findByIdAndUpdate(
        request.sender,
        { $push: { friends: req.user.id } }
      );
      
      // Update request status
      user.friendRequests[requestIndex].status = 'accepted';
    } else {
      // Reject friend request
      user.friendRequests[requestIndex].status = 'rejected';
    }
    
    await user.save();
    
    res.json({ message: `Friend request ${accept ? 'accepted' : 'rejected'}` });
  } catch (error) {
    console.error('Response to friend request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get friend requests
router.get('/friend-requests', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('friendRequests.sender', 'username email avatar');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.friendRequests);
  } catch (error) {
    console.error('Get friend requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get friends list
router.get('/friends', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('friends', 'username email avatar status lastSeen');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.friends);
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
