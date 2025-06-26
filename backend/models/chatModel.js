const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
    {
        
        messages: [
            {
                text: { type: String, required: true }, // Message text
                sender: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                receiver: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                createdAt: { type: Date, default: Date.now }, // Timestamp for each message
            },
            

        ],
       
    }, 
    { timestamps: true }
);

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;