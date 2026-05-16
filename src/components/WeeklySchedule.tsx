
import React from 'react';
import { Task, Goal } from '../types';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Check, Clock } from 'lucide-react';

interface WeeklyScheduleProps {
  tasks: Task[];
  goals: Goal[];
  onAddTask: (date: Date) => void;
  onToggleTask: (taskId: string) => void;
}

export const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({ tasks, goals, onAddTask, onToggleTask }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  const prevWeek = () => setCurrentDate(addDays(currentDate, -7));
  const nextWeek = () => setCurrentDate(addDays(currentDate, 7));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Weekly Schedule</h1>
          <p className="text-slate-500">Plan your steps towards your goals.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
          <button onClick={prevWeek} className="p-2 hover:bg-slate-50 rounded-lg transition-all">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <span className="font-semibold text-slate-700 min-w-[120px] text-center">
            {format(startDate, 'MMM d')} - {format(addDays(startDate, 6), 'MMM d')}
          </span>
          <button onClick={nextWeek} className="p-2 hover:bg-slate-50 rounded-lg transition-all">
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day, i) => {
          const dayTasks = tasks.filter(t => isSameDay(new Date(t.date), day));
          const isToday = isSameDay(day, new Date());

          return (
            <div 
              key={i} 
              className={`bg-white rounded-2xl border ${isToday ? 'border-indigo-200 ring-2 ring-indigo-50' : 'border-slate-100'} p-4 flex flex-col h-[500px] shadow-sm`}
            >
              <div className="text-center mb-4 pb-4 border-b border-slate-50">
                <span className={`text-xs font-bold uppercase tracking-wider ${isToday ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {format(day, 'EEE')}
                </span>
                <div className={`mt-1 w-8 h-8 flex items-center justify-center mx-auto rounded-full text-lg font-bold ${isToday ? 'bg-indigo-600 text-white' : 'text-slate-900'}`}>
                  {format(day, 'd')}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                {dayTasks.map(task => {
                  const goal = goals.find(g => g.id === task.goalId);
                  return (
                    <div 
                      key={task.id} 
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleTask(task.id);
                      }}
                      className={`group p-3 rounded-xl border border-slate-100 cursor-pointer transition-all hover:shadow-md ${task.completed ? 'bg-slate-50 opacity-60' : 'bg-white'}`}
                    >
                      <div className="flex items-start gap-2 mb-1">
                        <div className={`mt-1 w-4 h-4 rounded border flex items-center justify-center transition-colors ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 group-hover:border-indigo-500'}`}>
                          {task.completed && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-sm font-semibold leading-tight break-words ${task.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                            {task.title}
                          </h4>
                          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight truncate">
                            {goal?.title || 'General'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <Clock className="w-3 h-3 text-slate-300" />
                        <span className="text-[10px] font-medium text-slate-400 uppercase">
                          {task.time || 'All Day'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button 
                onClick={() => onAddTask(day)}
                className="mt-4 w-full py-2 border-2 border-dashed border-slate-100 rounded-xl text-slate-400 hover:border-indigo-200 hover:text-indigo-600 transition-all flex items-center justify-center"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
