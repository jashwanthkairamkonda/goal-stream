
import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Target, 
  Settings, 
  LogOut, 
  Mic, 
  Focus,
  PlusCircle
} from 'lucide-react';
import { cn } from '../utils/cn';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onAddGoal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout, onAddGoal }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'schedule', label: 'Weekly Schedule', icon: Calendar },
    { id: 'goals', label: 'My Goals', icon: Target },
    { id: 'focus', label: 'Focus Mode', icon: Focus },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r border-slate-200 flex flex-col p-4 fixed left-0 top-0">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
          <Target className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold text-slate-900">GoalStream</span>
      </div>

      <button
        onClick={onAddGoal}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl mb-8 flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-100"
      >
        <PlusCircle className="w-5 h-5" />
        New Goal
      </button>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
              activeTab === item.id
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="pt-4 border-t border-slate-100 space-y-1">
        <button
          onClick={() => setActiveTab('voice')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
        >
          <Mic className="w-5 h-5 text-rose-500" />
          <span className="font-medium">Voice Command</span>
        </button>
        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};
