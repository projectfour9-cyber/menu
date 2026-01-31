
import React, { useState, useEffect } from 'react';

const MESSAGES = [
  "Preheating the imagination...",
  "Spilling the secret spices...",
  "Asking the fridge for advice...",
  "Whipping up some magic...",
  "Tasting everything (twice!)...",
  "Adding a pinch of awesome...",
];

export const Loader: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-20 space-y-8">
      <div className="relative">
        <div className="text-6xl animate-bounce">👨‍🍳</div>
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-2 bg-slate-200 rounded-full blur-[2px] opacity-50 scale-x-150 animate-pulse"></div>
      </div>
      <div className="text-center">
        <p className="text-violet-600 font-bold text-xl mb-1">
          Chef is busy!
        </p>
        <p className="text-pink-500 font-medium italic animate-pulse">
          "{MESSAGES[msgIndex]}"
        </p>
      </div>
    </div>
  );
};
