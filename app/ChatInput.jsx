import React, { useState } from 'react';

const ChatInput = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSend} className="flex items-center w-full px-4 py-2 bg-white rounded-full shadow-lg border border-purple-200 focus-within:ring-2 focus-within:ring-purple-400 transition-all">
      <input
        type="text"
        placeholder={disabled ? "Misty is thinking..." : "What's on your mind?..."}
        className="flex-1 border-none outline-none py-3 px-4 text-base bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={disabled}
      />
      


      <button type="submit" disabled={disabled} className="ml-2 px-6 py-3 bg-purple-500 text-white rounded-full font-semibold hover:bg-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-purple-300">
        {disabled ? "⏳" : "Send"}
      </button>
    </form>
  );
};

export default ChatInput;
