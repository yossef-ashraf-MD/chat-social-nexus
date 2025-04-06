
const express = require('express');
const Room = require('../models/room.model');
const Message = require('../models/message.model');
const auth = require('../middleware/auth');
const router = express.Router();

// Create a new chat room
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, members } = req.body;
    
    // Create new room
    const room = new Room({
      name,
      description,
      owner: req.user.id,
      members: [req.user.id, ...members]
    });
    
    await room.save();
    
    // Populate members info
    const populatedRoom = await Room.findById(room._id)
      .populate('owner', 'username avatar')
      .populate('members', 'username avatar status');
    
    res.status(201).json(populatedRoom);
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all rooms for the user
router.get('/', auth, async (req, res) => {
  try {
    // Find rooms where user is a member
    const rooms = await Room.find({ members: req.user.id })
      .populate('owner', 'username avatar')
      .populate('members', 'username avatar status');
    
    // For each room, get the most recent message and unread count
    const roomsWithMetadata = await Promise.all(
      rooms.map(async (room) => {
        const lastMessage = await Message.findOne({ room: room._id })
          .sort({ createdAt: -1 })
          .populate('sender', 'username avatar');
        
        const unreadCount = await Message.countDocuments({
          room: room._id,
          sender: { $ne: req.user.id },
          readBy: { $ne: req.user.id }
        });
        
        return {
          ...room.toObject(),
          lastMessage: lastMessage || null,
          unreadCount
        };
      })
    );
    
    res.json(roomsWithMetadata);
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single room by ID
router.get('/:roomId', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId)
      .populate('owner', 'username avatar')
      .populate('members', 'username avatar status');
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Check if user is a member
    if (!room.members.some(member => member._id.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to access this room' });
    }
    
    res.json(room);
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages for a room
router.get('/:roomId/messages', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Check if user is a member
    if (!room.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to access this room' });
    }
    
    // Get messages
    const messages = await Message.find({ room: req.params.roomId })
      .populate('sender', 'username avatar')
      .sort({ createdAt: 1 });
    
    // Mark messages as read
    await Message.updateMany(
      { 
        room: req.params.roomId, 
        sender: { $ne: req.user.id },
        readBy: { $ne: req.user.id }
      },
      { $push: { readBy: req.user.id } }
    );
    
    res.json(messages);
  } catch (error) {
    console.error('Get room messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a member to a room
router.post('/:roomId/members', auth, async (req, res) => {
  try {
    const { userId } = req.body;
    
    const room = await Room.findById(req.params.roomId);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Check if requester is the owner
    if (room.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only room owner can add members' });
    }
    
    // Check if user is already a member
    if (room.members.includes(userId)) {
      return res.status(400).json({ message: 'User is already a member' });
    }
    
    // Add member
    room.members.push(userId);
    await room.save();
    
    // Get updated room with populated members
    const updatedRoom = await Room.findById(req.params.roomId)
      .populate('owner', 'username avatar')
      .populate('members', 'username avatar status');
    
    res.json(updatedRoom);
  } catch (error) {
    console.error('Add room member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove a member from a room
router.delete('/:roomId/members/:userId', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Only owner can remove members, or user can remove themselves
    if (room.owner.toString() !== req.user.id && req.params.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to remove this member' });
    }
    
    // Remove member
    room.members = room.members.filter(id => id.toString() !== req.params.userId);
    await room.save();
    
    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Remove room member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
