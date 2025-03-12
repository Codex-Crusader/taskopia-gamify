
export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate?: Date;
  completed: boolean;
  createdAt: Date;
  points: number;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  image: string;
  requiredLevel: number;
  unlocked: boolean;
}

export interface UserProgress {
  level: number;
  points: number;
  tasksCompleted: number;
  streakDays: number;
  nextLevelPoints: number;
}
