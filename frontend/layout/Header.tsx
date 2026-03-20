import React from 'react';

export default function Header() {
  return (
    <header className="h-[50px] bg-[#11111b] border-b border-[#313244] flex items-center px-6">
      <h1 className="text-xl font-bold bg-gradient-to-r from-[#cba6f7] to-[#89b4fa] bg-clip-text text-transparent mr-2">
        CodeNavigator
      </h1>
    </header>
  );
}