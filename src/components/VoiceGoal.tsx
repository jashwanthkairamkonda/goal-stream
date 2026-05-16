
import React, { useState } from 'react';
import { Mic, X, Check, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface VoiceGoalProps {
  onClose: () => void;
  onAddGoal: (title: string) => void;
}

export const VoiceGoal: React.FC<VoiceGoalProps> = ({ onClose, onAddGoal }) => {
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'success'>('idle');

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      // Fallback to simulation if not supported
      setStatus('listening');
      setTimeout(() => {
        setTranscript("Learn professional photography by summer 2024");
        setStatus('processing');
        setTimeout(() => setStatus('success'), 1000);
      }, 2000);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setStatus('listening');
      setTranscript('');
    };

    recognition.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setTranscript(speechToText);
      setStatus('processing');
      setTimeout(() => setStatus('success'), 1000);
    };

    recognition.onerror = () => {
      setStatus('idle');
      alert('Speech recognition error. Please try again.');
    };

    recognition.start();
  };

  const handleConfirm = () => {
    onAddGoal(transcript);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-bold text-slate-900">Voice Assistant</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className={`relative mb-8 ${status === 'listening' ? 'scale-110' : ''} transition-all duration-300`}>
              {status === 'listening' && (
                <div className="absolute inset-0 bg-rose-500/20 rounded-full animate-ping" />
              )}
              <button 
                onClick={startListening}
                disabled={status === 'listening' || status === 'processing'}
                className={`relative w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all ${
                  status === 'listening' ? 'bg-rose-500 shadow-rose-200' : 
                  status === 'success' ? 'bg-emerald-500 shadow-emerald-200' :
                  'bg-indigo-600 shadow-indigo-200'
                }`}
              >
                {status === 'processing' ? (
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                ) : status === 'success' ? (
                  <Check className="w-10 h-10 text-white" />
                ) : (
                  <Mic className="w-10 h-10 text-white" />
                )}
              </button>
            </div>

            <div className="min-h-[80px] w-full px-4 mb-8">
              {status === 'idle' && (
                <p className="text-slate-500 text-lg">Tap the microphone and say your goal...</p>
              )}
              {status === 'listening' && (
                <p className="text-slate-400 text-lg italic">Listening...</p>
              )}
              {status === 'processing' && (
                <div className="space-y-2">
                  <p className="text-slate-900 text-xl font-medium">"{transcript}"</p>
                  <p className="text-indigo-600 text-sm font-semibold">Processing your request...</p>
                </div>
              )}
              {status === 'success' && (
                <div className="space-y-4">
                  <p className="text-slate-900 text-xl font-medium">"{transcript}"</p>
                  <div className="flex gap-3 justify-center">
                    <button 
                      onClick={handleConfirm}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-100"
                    >
                      Confirm Goal
                    </button>
                    <button 
                      onClick={() => setStatus('idle')}
                      className="px-6 py-2 bg-slate-100 text-slate-600 rounded-xl font-semibold hover:bg-slate-200"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <p className="text-xs text-slate-400">
              Try: "Add a goal to read 10 books this year" or "Schedule a gym session for tomorrow morning"
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
