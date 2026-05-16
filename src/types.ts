
export interface Task {
  id: string;
  goalId: string;
  title: string;
  completed: boolean;
  date: string; // ISO string
  time?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'Health' | 'Career' | 'Personal' | 'Finance' | 'Other';
  color: string;
  progress: number;
  deadline: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}
