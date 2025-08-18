// ChatMessages.jsx
import React, { useRef, useEffect } from "react";

const ChatMessages = ({ messages, userName }) => {
  const messagesEndRef = useRef();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full max-w-2xl flex-1 overflow-y-auto py-4 px-2 mx-auto flex flex-col custom-scrollbar" style={{maxHeight: '60vh'}}>
      {messages.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Hi there, {userName}!
            </h1>
            <p className="text-gray-600 text-lg">
              I'm Misty, your friendly assistant. I'm here to help you with anything you need.
            </p>
            <div className="mt-6 space-y-2">
              <p className="text-sm text-gray-500">💡 Try asking me:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">"What's the weather like?"</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">"Act like my partner.😘"</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">"Tell me a joke"</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        messages.map((msg, i) => (
          <div
            key={i}
            className={`flex mb-4 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex flex-col max-w-xs md:max-w-md lg:max-w-lg">
              {msg.role === "ai" && (
                <div className="flex items-center mb-1">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white text-xs font-bold">K</span>
                  </div>
                  <span className="text-xs text-gray-500">K.AI</span>
                </div>
              )}
              
              <div
                className={`p-3 rounded-2xl shadow-lg relative ${
                  msg.role === "user"
                    ? "bg-purple-500 text-white rounded-br-none"
                    : msg.isTyping
                    ? "bg-gray-100 text-gray-600"
                    : "bg-white text-gray-900 rounded-bl-none border border-gray-200"
                }`}
              >
                {msg.isTyping ? (
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                ) : (
                  <div>
                    <p className="break-words">{msg.text}</p>
                    {msg.timestamp && (
                      <p className={`text-xs mt-1 ${
                        msg.role === "user" ? "text-purple-200" : "text-gray-400"
                      }`}>
                        {formatTime(msg.timestamp)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
