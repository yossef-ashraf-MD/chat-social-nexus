
const jwt = require('jsonwebtoken');
const User = require('./models/user.model');
const Message = require('./models/message.model');

module.exports = (io) => {
  // Users connected with socket id mapping
  const connectedUsers = {};

  // Middleware for authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    console.log('New client connected:', socket.id);
    
    try {
      // Add user to connected users
      const user = await User.findById(socket.userId);
      if (user) {
        connectedUsers[socket.userId] = socket.id;
        // Update user status to online
        await User.findByIdAndUpdate(socket.userId, { status: 'online' });
        // Broadcast user online status
        io.emit('user_status', { userId: socket.userId, status: 'online' });
      }
    } catch (error) {
      console.error('Socket connection error:', error);
    }

    // Join personal room for direct messages
    socket.join(socket.userId);
    
    // Handle join room
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.userId} joined room ${roomId}`);
    });

    // Handle leave room
    socket.on('leave_room', (roomId) => {
      socket.leave(roomId);
      console.log(`User ${socket.userId} left room ${roomId}`);
    });

    // Handle direct message
    socket.on('direct_message', async (data) => {
      try {
        const { receiverId, content, type } = data;
        
        // Create and save the message
        const message = new Message({
          sender: socket.userId,
          receiver: receiverId,
          content,
          type
        });
        
        const savedMessage = await message.save();
        const populatedMessage = await Message.findById(savedMessage._id)
          .populate('sender', 'username avatar')
          .populate('receiver', 'username avatar');
        
        // Send to receiver if online
        if (connectedUsers[receiverId]) {
          io.to(connectedUsers[receiverId]).emit('direct_message', populatedMessage);
        }
        
        // Send back to sender for confirmation
        socket.emit('direct_message', populatedMessage);
      } catch (error) {
        console.error('Direct message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle room message
    socket.on('room_message', async (data) => {
      try {
        const { roomId, content, type } = data;
        
        // Create and save the message
        const message = new Message({
          sender: socket.userId,
          room: roomId,
          content,
          type
        });
        
        const savedMessage = await message.save();
        const populatedMessage = await Message.findById(savedMessage._id)
          .populate('sender', 'username avatar')
          .populate('room');
        
        // Broadcast to everyone in the room
        io.to(roomId).emit('room_message', populatedMessage);
      } catch (error) {
        console.error('Room message error:', error);
        socket.emit('error', { message: 'Failed to send message to room' });
      }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      const { roomId, isTyping } = data;
      
      if (roomId) {
        // Broadcast to room that user is typing
        socket.to(roomId).emit('typing', { userId: socket.userId, isTyping });
      } else if (data.receiverId && connectedUsers[data.receiverId]) {
        // Send to specific user in direct message
        io.to(connectedUsers[data.receiverId]).emit('typing', { userId: socket.userId, isTyping });
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log('Client disconnected:', socket.id);
      
      try {
        // Remove from connected users
        delete connectedUsers[socket.userId];
        
        // Update user status to offline
        await User.findByIdAndUpdate(socket.userId, { status: 'offline', lastSeen: new Date() });
        
        // Broadcast user offline status
        io.emit('user_status', { userId: socket.userId, status: 'offline' });
      } catch (error) {
        console.error('Socket disconnect error:', error);
      }
    });
  });
};
