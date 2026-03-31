import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Send, ChevronLeft, Loader2 } from "lucide-react";
import { serverurl } from "../App";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

// ================= MERKOVA PREMIUM BACKGROUND =================
const MerkovaBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-black to-purple-900" />
    <div className="absolute w-[700px] h-[700px] bg-purple-600/20 blur-[160px] rounded-full top-[-300px] left-[-300px]" />
    <div className="absolute w-[700px] h-[700px] bg-indigo-600/20 blur-[160px] rounded-full bottom-[-300px] right-[-300px]" />
  </div>
);

// ================= MERKOVA CHAT UI =================
const MerkovaChat = () => {
  const { userData } = useSelector(s => s.user);
  const userId = userData?._id;

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [loadingChats, setLoadingChats] = useState(false);
  const [sendingMsg, setSendingMsg] = useState(false);
  const [typing, setTyping] = useState(false);

  const scrollRef = useRef();

  // ======== FETCH CHATS =========
  const fetchChats = async () => {
    try {
      setLoadingChats(true);
      const res = await axios.get(`${serverurl}/chat/${userId}`);
      setChats(res.data || []);
    } catch {
      toast.error("Failed to fetch chats");
    } finally {
      setLoadingChats(false);
    }
  };

  // ======== FETCH MESSAGES =========
  const fetchMessages = async (chatId) => {
    try {
      const res = await axios.get(`${serverurl}/chat/messages/${chatId}`);
      setMessages(res.data || []);
    } catch {
      toast.error("Failed to fetch messages");
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedChat) fetchMessages(selectedChat._id);
  }, [selectedChat]);

  // ======== AUTO SCROLL =========
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ======== SEND MESSAGE =========
  const handleSendMessage = async () => {
    if (!newMsg.trim() || !selectedChat) return;
    try {
      setSendingMsg(true);
      const res = await axios.post(`${serverurl}/chat/message`, {
        chatId: selectedChat._id,
        senderId: userId,
        text: newMsg,
      });
      setMessages(prev => [...prev, res.data]);
      setNewMsg("");
    } catch {
      toast.error("Failed to send message");
    } finally {
      setSendingMsg(false);
    }
  };

  // ======== ENTER KEY SEND =========
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="relative min-h-screen flex bg-black/90 text-white overflow-hidden">
      <MerkovaBackground />
      <Toaster position="top-right" />

      {/* ======= CHAT LIST ======= */}
      <div className="w-[320px] border-r border-white/20 flex flex-col">
        <h2 className="text-xl font-bold text-purple-300 p-4 border-b border-white/10">
          Merkova Chats
        </h2>
        <div className="flex-1 overflow-y-auto">
          {loadingChats ? (
            <div className="text-center py-10 text-gray-400">
              <Loader2 className="animate-spin mx-auto" />
            </div>
          ) : chats.length ? (
            chats.map(chat => {
              const otherMember = chat.members.find(m => m._id !== userId);
              return (
                <motion.div
                  key={chat._id}
                  layout
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 cursor-pointer flex items-center gap-3 hover:bg-white/10 transition rounded-lg ${
                    selectedChat?._id === chat._id ? "bg-white/20" : ""
                  }`}
                  onClick={() => setSelectedChat(chat)}
                >
                  <User className="text-purple-400" />
                  <div className="flex-1">
                    <p className="font-bold truncate">{otherMember?.name || "Unknown"}</p>
                    <p className="text-sm text-gray-300 truncate">
                      {chat.lastMessage?.text || "Start Chat"}
                    </p>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <p className="text-center text-gray-400 mt-10">No chats yet</p>
          )}
        </div>
      </div>

      {/* ======= MESSAGES PANEL ======= */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="flex items-center gap-3 p-4 border-b border-white/10">
              <button className="md:hidden" onClick={() => setSelectedChat(null)}>
                <ChevronLeft />
              </button>
              <User className="text-purple-400" />
              <h3 className="font-bold">
                {selectedChat.members.find(m => m._id !== userId)?.name || "Unknown"}
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-purple-900">
              <AnimatePresence>
                {messages.map(msg => (
                  <motion.div
                    key={msg._id}
                    ref={scrollRef}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`max-w-[70%] p-3 rounded-2xl break-words shadow-lg ${
                      msg.sender._id === userId
                        ? "bg-purple-600 ml-auto text-white"
                        : "bg-white/10 text-gray-100"
                    }`}
                  >
                    {msg.text}
                  </motion.div>
                ))}
              </AnimatePresence>
              {typing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="max-w-[40%] p-2 rounded-xl bg-white/20 text-gray-100 italic"
                >
                  Typing...
                </motion.div>
              )}
            </div>

            <div className="flex p-4 border-t border-white/10 gap-3 items-center">
              <textarea
                value={newMsg}
                onChange={e => setNewMsg(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 p-3 rounded-2xl bg-white/10 border border-white/20 focus:outline-none text-white resize-none h-12"
              />
              <button
                onClick={handleSendMessage}
                className="p-3 bg-purple-600 rounded-full hover:bg-purple-700 transition"
              >
                {sendingMsg ? <Loader2 className="animate-spin" /> : <Send />}
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-xl">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default MerkovaChat;
