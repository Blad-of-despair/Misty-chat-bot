import React from 'react';

const Sidebar = () => (
  <aside className="hidden md:flex flex-col items-center justify-between h-7  bg-gradient-to-b from-purple-300 to-purple-500 shadow-xl rounded-2xl py-6 mr-4">
    <div className="flex flex-col items-center gap-1">
      <div className="w-16 h-10 bg-white rounded-full flex items-center justify-center shadow-md mb-8">
        <span className="text-purple-600 font-bold text-2xl">MISTY</span>
      </div>

    </div>
  </aside>
);

export default Sidebar;
