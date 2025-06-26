const createError = require("http-errors");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");


const getAllUserList = async (req, res) => {
    try {
        const data = await User.find().select("-password -blogs");

        const baseUrl = `${req.protocol}://${req.get('host')}`;

        // const users = [{...data._doc, avatar: `${baseUrl}/uploads/userAvatar/${data.avatar}`}]
        const users = data.map(user => ({
            ...user._doc,
            avatar: `${baseUrl}/uploads/userAvatar/${user.avatar}`,
            online:false
        }));

        res.status(200).json({users, message: "All users fetched successfully!"});
    } catch (error) {
        res.status(error.status || 500).json({
        error: error.message || "Internal Server Error",
        details: error.details || null,
        });
    }
}

//input chat message
const inputChatMessage = async (req, res) => {
    try {
        const { message, sender, receiver } = req.body;

        // Validate if sender and receiver exist
        const msgSender = await User.findById(sender);
        const msgReceiver = await User.findById(receiver);

        if (!msgSender || !msgReceiver) {
            throw createError(404, "Sender or receiver not found");
        }

        // Check if a chat already exists between sender and receiver
        let chat = await Chat.findOne({
            $or: [
                { "messages.sender": sender, "messages.receiver": receiver },
                { "messages.sender": receiver, "messages.receiver": sender },
            ],
        });
        const io = req.app.get('io');

        if (chat) {
            // Add the new message to the existing chat
            chat.messages.push({ text: message, sender, receiver });
            await chat.save();

            // Emit the new message to clients
            io.emit('newMessage', {...chat._doc, messages: chat.messages[chat.messages.length - 1]});
            
            return res.status(200).json({
                message: "Message added to the existing chat successfully!",
                chat,
            });
        }

        // Create a new chat with the initial message
        chat = await Chat.create({
            messages: [{ text: message, sender, receiver }],
        });

        // Add the chat reference to the user(s)
        if (sender === receiver) {
            // If sender and receiver are the same, add the chat ID only once
            msgSender.chats.push(chat._id);
        } else {
            // Add the chat ID to both sender and receiver
            msgSender.chats.push(chat._id);
            msgReceiver.chats.push(chat._id);
        }

        await msgSender.save();
        if (sender !== receiver) {
            await msgReceiver.save();
        }

        // Emit the new message to clients
        io.emit('newMessage', {...chat._doc, messages: chat.messages[chat.messages.length - 1]});

        return res.status(200).json({
            message: "New chat created and message sent successfully!",
            chat,
        });

    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message || "Internal Server Error",
            details: error.details || null,
        });
    }
};



//get chats
const getChats = async (req, res) => {
    try {
        const { sender, receiver } = req.params;

        // Validate if sender and receiver exist
        const msgSender = await User.findById(sender);
        const msgReceiver = await User.findById(receiver);

        if (!msgSender || !msgReceiver) {
            throw createError(404, "Sender or receiver not found");
        }

        // Find the chat between sender and receiver
        let chat;
        if (sender === receiver) {
            // If sender and receiver are the same, find the self-chat (if any)
            chat = await Chat.findOne({
                "messages.sender": sender,
                "messages.receiver": sender
            }).populate("messages.sender", "username")
              .populate("messages.receiver", "username");
        } else {
            // If sender and receiver are different, find the chat with either sender or receiver
            chat = await Chat.findOne({
                $or: [
                    { "messages.sender": sender, "messages.receiver": receiver },
                    { "messages.sender": receiver, "messages.receiver": sender }
                ]
            }).populate("messages.sender", "username")
              .populate("messages.receiver", "username");
        }

        if (!chat) {
            throw createError(404, "Chat not found");
        }

        res.status(200).json({ chat, message: "Chat fetched successfully!" });
    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message || "Internal Server Error",
            details: error.details || null,
        });
    }
};


// chat delete
const deleteChatMessage = async (req, res) => {
    try {
        const { chatId, msgId } = req.params;

        // Find the chat to delete
        const chat = await Chat.findById(chatId);

        if (!chat) {
            throw createError(404, "Chat not found");
        }

        // Delete the chat
        const result = await Chat.findOneAndUpdate(
            { _id: chatId },
            { $pull: { messages: { _id: msgId } } },
            { new: false } // Return the document before the update
          );
          const deletedMessage = result.messages.filter((msg) => msg._id.toString() === String(msgId));

        res.status(200).json({deletedMessage, message: "Chat deleted successfully!" });
    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message || "Internal Server Error",
            details: error.details || null,
        });
    }
};




module.exports = {
    getAllUserList,
    inputChatMessage,
    getChats,
    deleteChatMessage,
};

