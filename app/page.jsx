"use client"
import React, { useState, useEffect } from "react";
import Sidebar from './Sidebar'
import ChatInput from './ChatInput'
import ChatMessages from "./ChatMessages";

const Page = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState("User");

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    const savedUserName = localStorage.getItem('userName');
    
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
    
    if (savedUserName) {
      setUserName(savedUserName);
    }
  }, []);

  // Simple name input modal
  const [showNameModal, setShowNameModal] = useState(false);
  const [tempName, setTempName] = useState("");

  useEffect(() => {
    if (!localStorage.getItem('userName')) {
      setShowNameModal(true);
    }
  }, []);

  const handleNameSubmit = () => {
    const name = tempName.trim() || "User";
    setUserName(name);
    localStorage.setItem('userName', name);
    setShowNameModal(false);
  };

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Rate limiting state
  const [lastMessageTime, setLastMessageTime] = useState(0);
  const RATE_LIMIT_DELAY = 3000; // 3 seconds between messages

  // Called when user sends a message from ChatInput
  const handleSend = async (userMessage) => {
    if (userMessage.trim() === "" || isLoading) return;

    // Check rate limiting
    const now = Date.now();
    if (now - lastMessageTime < RATE_LIMIT_DELAY) {
      const remainingTime = Math.ceil((RATE_LIMIT_DELAY - (now - lastMessageTime)) / 1000);
      const rateLimitMessage = { 
        role: "ai", 
        text: `Please wait ${remainingTime} seconds before sending another message. I need a moment to think! 🤔`,
        timestamp: new Date().toISOString()
      };
      setMessages([...messages, rateLimitMessage]);
      return;
    }

    setLastMessageTime(now);
    setIsLoading(true);
    const userMsg = { 
      role: "user", 
      text: userMessage,
      timestamp: new Date().toISOString()
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);

    // Add typing indicator
    const typingMessage = { role: "ai", text: "", isTyping: true };
    setMessages([...newMessages, typingMessage]);

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: newMessages.slice(-10)
        })
      });

      const data = await response.json();
      
      // Remove typing indicator and add actual response
      const updatedMessages = [...newMessages, { 
        role: "ai", 
        text: data.reply,
        timestamp: new Date().toISOString()
      }];
      setMessages(updatedMessages);
      
      // Save to localStorage
      localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove typing indicator and add error message
      setMessages([...newMessages, { 
        role: "ai", 
        text: "I apologize, but I'm having trouble connecting right now. Please try again.",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 to-white md:p-8 p-2">
      <Sidebar />
      <main className="flex flex-col flex-1 mx-auto w-full max-w-6xl md:m-10 m-2 rounded-3xl border border-purple-200 bg-white shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center px-6 py-3 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Chat with Misty</h2>
            <p className="text-sm text-gray-500">Welcome back, {userName}!</p>
          </div>
          <button
            onClick={clearChat}
            className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
            title="Clear chat history"
          >
            Clear Chat
          </button>
        </div>
        
        <div className="flex-1 flex flex-col justify-end">
          <ChatMessages messages={messages} userName={userName} />
        </div>
        
        <div className="p-4 bg-white border-t border-gray-100">
          <ChatInput onSend={handleSend} disabled={isLoading} />
        </div>
      </main>

      {/* Name Input Modal */}
      {showNameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Welcome to Misty Chat!</h3>
            <p className="text-gray-600 mb-4 text-center">What should we call you?</p>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
              onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleNameSubmit}
                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Start Chatting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page
