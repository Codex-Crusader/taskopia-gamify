
import { Task, UserProgress } from '@/types';

// Constants for the game logic
const POINTS_PER_LEVEL = 100;
const BASE_POINTS = 10;

// Calculate points based on priority
export const calculateTaskPoints = (priority: Task['priority']): number => {
  switch (priority) {
    case 'low':
      return BASE_POINTS;
    case 'medium':
      return BASE_POINTS * 2;
    case 'high':
      return BASE_POINTS * 3;
    default:
      return BASE_POINTS;
  }
};

// Calculate current level based on total points
export const calculateLevel = (points: number): number => {
  return Math.floor(points / POINTS_PER_LEVEL) + 1;
};

// Calculate points needed for next level
export const calculateNextLevelPoints = (points: number): number => {
  const currentLevel = calculateLevel(points);
  return currentLevel * POINTS_PER_LEVEL;
};

// Calculate progress percentage towards next level
export const calculateLevelProgress = (points: number): number => {
  const currentLevel = calculateLevel(points);
  const pointsForCurrentLevel = (currentLevel - 1) * POINTS_PER_LEVEL;
  const pointsInCurrentLevel = points - pointsForCurrentLevel;
  
  return (pointsInCurrentLevel / POINTS_PER_LEVEL) * 100;
};

// Add points from completed task
export const addPointsFromTask = (currentPoints: number, task: Task): number => {
  return currentPoints + task.points;
};

// Generate a new user progress object
export const generateInitialProgress = (): UserProgress => {
  return {
    level: 1,
    points: 0,
    tasksCompleted: 0,
    streakDays: 0,
    nextLevelPoints: POINTS_PER_LEVEL,
  };
};

// Update user progress after completing a task
export const updateProgressAfterTask = (
  progress: UserProgress,
  task: Task
): UserProgress => {
  const newPoints = progress.points + task.points;
  const newLevel = calculateLevel(newPoints);
  const leveledUp = newLevel > progress.level;
  
  return {
    level: newLevel,
    points: newPoints,
    tasksCompleted: progress.tasksCompleted + 1,
    streakDays: progress.streakDays, // This would be updated separately based on daily login
    nextLevelPoints: calculateNextLevelPoints(newPoints),
  };
};
