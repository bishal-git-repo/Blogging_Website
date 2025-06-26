
import React, { useEffect, useState } from "react";
import { FaUserPlus, FaEnvelope, FaPaperPlane, FaTrashAlt } from "react-icons/fa";
import axiosInstance from "../../services/axiosInstance";
import toastService from "../../services/toastifyMessage";
import socketService from "../../services/socketService";
import { useSelector } from "react-redux";

function Chat() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [users, setUsers] = useState([]);
  const [chatId, setChatId] = useState(null);

  const me = useSelector((state) => state.user.user);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("chat/users");
      if (response && response.data?.users) {
        setUsers(response.data.users); // Include the logged-in user
      } else {
        toastService.showMessage("Failed to fetch users", "error");
      }
    } catch (error) {
      toastService.showMessage("Error fetching users", "error");
    }
  };

  useEffect(() => {
    socketService.connect();
    socketService.on("userLoggedIn", (userLoggedIn) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === String(userLoggedIn) ? { ...user, online: true } : user
        )
      );
    });

    fetchUsers();

    return () => {
      socketService.disconnect();
    };
  }, []);

  const sendMessage = async () => {
    if (messageText.trim() !== "" && selectedUser && selectedUser._id) {
      try {
        await axiosInstance.post("chat/message", {
          sender: me._id,
          receiver: selectedUser._id,
          message: messageText,
        });

        // Emit the message through the socket
        socketService.emit("sendMessage", {
          sender: me._id,
          receiver: selectedUser._id,
          message: messageText,
        });

        setMessages((prevMessages) => [
          ...prevMessages,
          { text: messageText, sender: me._id, receiver: selectedUser._id },
        ]);
        setMessageText("");
      } catch (error) {
        toastService.showMessage("Error sending message", "error");
      }
    }
  };

  const getChatlist = async () => {
    if (selectedUser && selectedUser._id) {
      try {
        const response = await axiosInstance.get(
          `chat/message-list/${me._id}/${selectedUser._id}`
        );
        if (response && response.data?.chat) {
          const messagesData = response.data.chat.messages;
          const newMessages = messagesData.map((message) => ({
            _id: message._id,
            text: message.text,
            sender: message.sender._id,
          }));

          setMessages(newMessages);
          setChatId(response.data.chat._id);
        } else {
          toastService.showMessage("No chat found", "warning");
        }
      } catch (error) {
        toastService.showMessage("Error fetching messages", "error");
      }
    }
  };

  useEffect(() => {
    if (selectedUser && selectedUser._id) {
      getChatlist();
    }
  }, [selectedUser]);

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      if (newMessage && newMessage._id && newMessage.message) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };

    socketService.on("newMessage", handleNewMessage);

    return () => {
      if (typeof socketService.off === "function") {
        socketService.off("newMessage", handleNewMessage);
      } else if (typeof socketService.removeListener === "function") {
        socketService.removeListener("newMessage", handleNewMessage);
      }
    };
  }, []);

  const deleteMessage = async (msgId) => {
    if (chatId && msgId) {
      try {
        const response = await axiosInstance.delete(`chat/message/${chatId}/${msgId}`);
        if (response && response.data?.message) {
          setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== msgId));
          toastService.showMessage("Message deleted successfully", "success");
        } else {
          toastService.showMessage("Failed to delete message", "error");
        }
      } catch (error) {
        toastService.showMessage("Error deleting message", "error");
      }
    } else {
      toastService.showMessage("Invalid message ID", "error");
    }
  };

  // ... rest of the JSX code (unchanged)
  return (
    <div className="min-h-screen pt-20 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-8 flex">
      <div className="bg-white bg-opacity-30 ml-12 backdrop-blur-lg rounded-lg shadow-lg p-6 w-1/4 overflow-y-auto h-screen scrollbar-hide">
        {users.map((user) => (
          <div
            key={user._id}
            className="flex items-center p-4 mb-4 bg-white bg-opacity-80 rounded-lg shadow-md relative cursor-pointer"
            onClick={() => setSelectedUser(user)}
          >
            <div className="relative">
              <img
                src={user.avatar}
                alt={`${user.username}'s profile`}
                className="w-16 h-16 rounded-full border-4 border-white shadow-md"
              />
              <span
                className={`absolute top-0 right-0 w-4 h-4 rounded-full ${
                  user.online ? "bg-green-500" : "bg-red-500"
                } border-2 border-white`}
              ></span>
            </div>
            <div className="flex-grow ml-4">
              <span className="block font-bold text-gray-800">{user.username}</span>
              <div className="flex space-x-4 mt-1">
                <FaUserPlus className="text-blue-500 cursor-pointer" title="Send Friend Request" />
                <FaEnvelope className="text-blue-500 cursor-pointer" title="Send Message" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white bg-opacity-30 backdrop-blur-lg rounded-lg shadow-lg p-6 w-2/3 ml-4">
        {selectedUser ? (
          <div>
            <div className="flex items-center mb-4 border-b-2 border-gray-200 pb-4">
              <img
                src={selectedUser.avatar}
                alt={`${selectedUser.username}'s profile`}
                className="w-12 h-12 rounded-full border-4 border-white shadow-md"
              />
              <div className="ml-4">
                <h2 className="text-2xl font-bold">{selectedUser.username}</h2>
                <span
                  className={`text-sm ${selectedUser.online ? "text-green-500 font-medium" : "text-red-500"}`}
                >
                  {selectedUser.online ? "Online" : "Offline"}
                </span>
              </div>
            </div>

            <div className="bg-white bg-opacity-80 rounded-lg shadow-md p-4 h-96 overflow-y-auto mb-4 relative scrollbar-hide">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center">Start chatting with {selectedUser.username}...</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`group flex items-center ${me._id === msg.sender ? "justify-end" : "justify-start"} mb-4 relative`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg transform transition-all duration-300 ${
                        me._id === msg.sender ? "bg-blue-500 text-white group-hover:translate-x-[-2rem]" : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {msg.text}
                    </div>

                    {me._id === msg.sender && (
                      <button
                        onClick={() => deleteMessage(msg._id)}
                        className="absolute top-1/2 transform -translate-y-1/2 -right-2 p-2 text-red-500 opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity"
                        title="Delete message"
                      >
                        <FaTrashAlt />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center border-t-2 border-gray-200 pt-4">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow p-2 rounded-lg border border-gray-300"
              />
              <button onClick={sendMessage} className="ml-2 p-2 rounded-lg bg-blue-500 text-white">
                <FaPaperPlane />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-800">Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;