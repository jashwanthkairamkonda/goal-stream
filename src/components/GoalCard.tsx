
import React from 'react';
import { Goal, Task } from '../types';
import { CheckCircle2, Circle, Plus, Calendar, Clock } from 'lucide-react';

interface GoalCardProps {
  goal: Goal;
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (goalId: string) => void;
}

import { Trash2, AlertCircle } from 'lucide-react';
import { isPast, isToday } from 'date-fns';

interface GoalCardProps {
  goal: Goal;
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (goalId: string) => void;
  onDeleteGoal: (goalId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, tasks, onToggleTask, onAddTask, onDeleteGoal, onDeleteTask }) => {
  const goalTasks = tasks.filter(t => t.goalId === goal.id);
  const deadlineDate = new Date(goal.deadline);
  const isFailed = isPast(deadlineDate) && !isToday(deadlineDate) && goal.progress < 100;

  return (
    <div className={`bg-white rounded-2xl shadow-sm border ${isFailed ? 'border-rose-200 bg-rose-50/10' : 'border-slate-100'} flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow relative`}>
      {isFailed && (
        <div className="absolute top-0 left-0 right-0 bg-rose-500 text-white text-[10px] font-bold py-1 px-3 flex items-center gap-1 z-10">
          <AlertCircle className="w-3 h-3" /> FAILED GOAL - DEADLINE PASSED
        </div>
      )}
      <div className={`p-6 border-b border-slate-50 ${isFailed ? 'mt-6' : ''}`} style={{ borderTop: isFailed ? 'none' : `4px solid ${goal.color}` }}>
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{goal.category}</span>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold ${isFailed ? 'text-rose-600' : 'text-indigo-600'}`}>{goal.progress}%</span>
            <button 
              onClick={() => onDeleteGoal(goal.id)}
              className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <h3 className={`text-xl font-bold mb-2 ${isFailed ? 'text-rose-900' : 'text-slate-900'}`}>{goal.title}</h3>
        <p className="text-slate-500 text-sm line-clamp-2 mb-4">{goal.description}</p>
        
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-700 rounded-full"
            style={{ width: `${goal.progress}%`, backgroundColor: goal.color }}
          />
        </div>
      </div>

      <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[300px] custom-scrollbar">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            Sub-Tasks <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[10px]">{goalTasks.length}</span>
          </h4>
          <button 
            onClick={() => onAddTask(goal.id)}
            className="flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg transition-all hover:bg-indigo-100 text-xs font-bold"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        </div>

        <div className="space-y-2">
          {goalTasks.length > 0 ? (
            goalTasks.map(task => (
              <div 
                key={task.id} 
                className="group flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => onToggleTask(task.id)}
              >
                <button className="focus:outline-none">
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 group-hover:text-indigo-400" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(task.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTask(task.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-rose-500 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-xs text-slate-400 italic">No tasks yet. Break down your goal!</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Clock className="w-3.5 h-3.5" />
          <span>Due {new Date(goal.deadline).toLocaleDateString()}</span>
        </div>
        <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-tight">
          Details
        </button>
      </div>
    </div>
  );
};
