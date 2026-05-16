
import React from 'react';
import { Goal, Task } from '../types';
import { CheckCircle2, Circle, Clock, TrendingUp, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';

interface DashboardProps {
  goals: Goal[];
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ goals, tasks, onToggleTask }) => {
  const completedTasks = tasks.filter(t => t.completed).length;
  const todayTasks = tasks.filter(t => {
    const today = new Date().toISOString().split('T')[0];
    return t.date.startsWith(today);
  });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Good morning, achiever!</h1>
        <p className="text-slate-500 mt-1">Here's what's happening with your goals today.</p>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active Goals', value: goals.length, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Tasks Completed', value: completedTasks, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Tasks Today', value: todayTasks.length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
            </div>
            <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Goals */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Active Goals</h2>
            <button className="text-indigo-600 text-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {goals.map(goal => (
              <div key={goal.id} className="group p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-8 rounded-full" style={{ backgroundColor: goal.color }} />
                    <div>
                      <h4 className="font-semibold text-slate-900">{goal.title}</h4>
                      <p className="text-xs text-slate-500">{goal.category}</p>
                    </div>
                  </div>
                  <button className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium text-slate-500">
                    <span>Progress</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 transition-all duration-500" 
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {goals.length === 0 && (
              <p className="text-center text-slate-400 py-8">No active goals yet. Start by adding one!</p>
            )}
          </div>
        </section>

        {/* Daily Schedule */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Today's Schedule</h2>
            <span className="text-sm font-medium text-slate-500">{format(new Date(), 'EEEE, MMM do')}</span>
          </div>
          <div className="space-y-4">
            {todayTasks.length > 0 ? todayTasks.map(task => (
              <div 
                key={task.id} 
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                onClick={() => onToggleTask(task.id)}
              >
                <button className="focus:outline-none">
                  {task.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-300 hover:text-indigo-400" />
                  )}
                </button>
                <div className="flex-1">
                  <h4 className={`font-medium ${task.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-400">{task.time || 'All day'}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-400">No tasks scheduled for today.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
