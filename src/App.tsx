
import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { WeeklySchedule } from './components/WeeklySchedule';
import { AddGoalModal } from './components/AddGoalModal';
import { AddTaskModal } from './components/AddTaskModal';
import { GoalCard } from './components/GoalCard';
import { FocusMode } from './components/FocusMode';
import { VoiceGoal } from './components/VoiceGoal';
import { Goal, Task, User } from './types';
import { AnimatePresence } from 'framer-motion';

const INITIAL_GOALS: Goal[] = [
  {
    id: '1',
    title: 'Learn React Native',
    description: 'Build cross-platform mobile apps',
    category: 'Career',
    color: '#6366f1',
    progress: 45,
    deadline: '2024-06-30'
  },
  {
    id: '2',
    title: 'Run a Marathon',
    description: 'Complete 42km by the end of the year',
    category: 'Health',
    color: '#f43f5e',
    progress: 20,
    deadline: '2024-12-31'
  }
];

const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    goalId: '1',
    title: 'Setup Environment',
    completed: true,
    date: new Date().toISOString(),
    time: '09:00'
  },
  {
    id: 't2',
    goalId: '1',
    title: 'Component Basics',
    completed: false,
    date: new Date().toISOString(),
    time: '11:00'
  }
];

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedGoalId, setSelectedGoalId] = useState<string | undefined>(undefined);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);

  useEffect(() => {
    // Check for failed goals on load
    const today = new Date();
    goals.forEach(goal => {
      const deadline = new Date(goal.deadline);
      if (deadline < today && goal.progress < 100) {
        // We could trigger a notification here
      }
    });
  }, [goals]);

  const deleteGoal = (id: string) => {
    if (confirm('Are you sure you want to delete this goal and all its tasks?')) {
      setGoals(prev => prev.filter(g => g.id !== id));
      setTasks(prev => prev.filter(t => t.goalId !== id));
    }
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (email: string) => {
    const newUser = { id: '1', email, name: email.split('@')[0] };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ));
    
    // Update goal progress (simple version)
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const goalTasks = tasks.filter(t => t.goalId === task.goalId);
      const completedCount = goalTasks.filter(t => t.id === taskId ? !t.completed : t.completed).length;
      const progress = Math.round((completedCount / goalTasks.length) * 100);
      
      setGoals(prev => prev.map(g => 
        g.id === task.goalId ? { ...g, progress } : g
      ));
    }
  };

  const addGoal = (newGoal: Omit<Goal, 'id' | 'progress'>) => {
    const goal: Goal = {
      ...newGoal,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0
    };
    setGoals(prev => [...prev, goal]);
    setIsAddGoalOpen(false);
  };

  const addTask = (taskData: { title: string; goalId: string; time: string; date: string }) => {
    const task: Task = {
      ...taskData,
      id: Math.random().toString(36).substr(2, 9),
      completed: false
    };
    setTasks(prev => [...prev, task]);
    setIsAddTaskOpen(false);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          if (tab === 'voice') setIsVoiceMode(true);
          else if (tab === 'focus') setIsFocusMode(true);
          else setActiveTab(tab);
        }} 
        onLogout={handleLogout}
        onAddGoal={() => setIsAddGoalOpen(true)}
      />

      <main className="flex-1 ml-64 p-8 max-w-7xl mx-auto w-full">
        {activeTab === 'dashboard' && (
          <Dashboard goals={goals} tasks={tasks} onToggleTask={toggleTask} />
        )}
        {activeTab === 'schedule' && (
          <WeeklySchedule 
            tasks={tasks} 
            goals={goals} 
            onAddTask={(date) => {
              setSelectedDate(date);
              setIsAddTaskOpen(true);
            }}
            onToggleTask={toggleTask}
          />
        )}
        {activeTab === 'goals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">My Goals</h1>
                <p className="text-slate-500">Break down your ambitions into actionable tasks.</p>
              </div>
              <button 
                onClick={() => setIsAddGoalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg shadow-indigo-100 transition-all"
              >
                Create Goal
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map(goal => (
                <GoalCard 
                  key={goal.id} 
                  goal={goal} 
                  tasks={tasks} 
                  onToggleTask={toggleTask}
                  onDeleteGoal={deleteGoal}
                  onDeleteTask={deleteTask}
                  onAddTask={(goalId) => {
                    setSelectedDate(new Date());
                    setSelectedGoalId(goalId);
                    setIsAddTaskOpen(true);
                  }}
                />
              ))}
              {goals.length === 0 && (
                <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
                  <p className="text-slate-400 text-lg">No goals created yet. Ready to start something big?</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <AnimatePresence>
        {isAddGoalOpen && (
          <AddGoalModal onClose={() => setIsAddGoalOpen(false)} onAdd={addGoal} />
        )}
        {isAddTaskOpen && selectedDate && (
          <AddTaskModal 
            date={selectedDate} 
            goals={goals}
            initialGoalId={selectedGoalId}
            onClose={() => {
              setIsAddTaskOpen(false);
              setSelectedGoalId(undefined);
            }} 
            onAdd={addTask} 
          />
        )}
        {isFocusMode && (
          <FocusMode onClose={() => setIsFocusMode(false)} />
        )}
        {isVoiceMode && (
          <VoiceGoal 
            onClose={() => setIsVoiceMode(false)} 
            onAddGoal={(title) => addGoal({
              title,
              description: 'Added via voice command',
              category: 'Other',
              color: '#6366f1',
              deadline: new Date().toISOString()
            })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
