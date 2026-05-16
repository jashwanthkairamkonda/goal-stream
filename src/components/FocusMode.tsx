
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Target, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface FocusModeProps {
  onClose: () => void;
}

export const FocusMode: React.FC<FocusModeProps> = ({ onClose }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center p-6"
    >
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 text-slate-400 hover:text-white transition-colors"
      >
        <X className="w-8 h-8" />
      </button>

      <div className="max-w-2xl w-full text-center">
        <div className="flex items-center justify-center gap-3 mb-12">
          <Target className="w-10 h-10 text-indigo-500" />
          <h2 className="text-3xl font-bold text-white tracking-tight">Focus Session</h2>
        </div>

        <div className="relative inline-block mb-12">
          <svg className="w-64 h-64 -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-slate-800"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={753.98}
              strokeDashoffset={753.98 * (1 - timeLeft / (25 * 60))}
              className="text-indigo-500 transition-all duration-1000"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-black text-white font-mono tracking-tighter">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6">
          <button 
            onClick={resetTimer}
            className="p-4 bg-slate-800 text-slate-400 rounded-full hover:bg-slate-700 hover:text-white transition-all"
          >
            <RotateCcw className="w-8 h-8" />
          </button>
          <button 
            onClick={toggleTimer}
            className="p-8 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/40 transform hover:scale-105"
          >
            {isActive ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-2" />}
          </button>
          <div className="w-16 h-16" /> {/* Spacer for symmetry */}
        </div>

        <p className="mt-12 text-slate-500 font-medium italic">"The secret of getting ahead is getting started."</p>
      </div>
    </motion.div>
  );
};
