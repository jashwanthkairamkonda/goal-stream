
import React, { useState } from 'react';
import { X, CheckCircle2, Clock } from 'lucide-react';
import { Goal } from '../types';

interface AddTaskModalProps {
  date: Date;
  goals: Goal[];
  initialGoalId?: string;
  onClose: () => void;
  onAdd: (task: { title: string; goalId: string; time: string; date: string }) => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ date, goals, initialGoalId, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [goalId, setGoalId] = useState(initialGoalId || goals[0]?.id || '');
  const [time, setTime] = useState('09:00');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      title,
      goalId,
      time,
      date: date.toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <CheckCircle2 className="text-white w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Add Task</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-all">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">What's the task?</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="e.g. Read 20 pages"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Assign to Goal</label>
            <select
              required
              value={goalId}
              onChange={(e) => setGoalId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            >
              <option value="">Select a goal</option>
              {goals.map(g => (
                <option key={g.id} value={g.id}>{g.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={!goalId}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
          >
            Add to Schedule
          </button>
        </form>
      </div>
    </div>
  );
};
