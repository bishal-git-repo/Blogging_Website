// external imports
const express = require('express');
const router = express.Router();

// internal imports
const {getAllUserList, inputChatMessage, getChats, deleteChatMessage} = require('../controllers/chatController');

router.get('/users', getAllUserList);

//input chat message
router.post('/message', inputChatMessage);

//get chat messages
router.get('/message-list/:sender/:receiver', getChats);

//delete chat message
router.delete('/message/:chatId/:msgId', deleteChatMessage);

module.exports = router;