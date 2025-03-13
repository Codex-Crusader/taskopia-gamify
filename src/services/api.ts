
import { Task, Reward, UserProgress } from '@/types';

const API_URL = 'http://localhost:5000/api';

// Helper function for making API requests
const apiRequest = async (endpoint: string, method: string = 'GET', data?: any) => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    
    // If the API is not available, fall back to localStorage data
    if (endpoint === '/data' && method === 'GET') {
      const savedData = localStorage.getItem('tasklevels-data');
      if (savedData) {
        return JSON.parse(savedData);
      }
    }
    
    throw error;
  }
};

// API functions
export const fetchAllData = async () => {
  return await apiRequest('/data');
};

export const saveAllData = async (progress: UserProgress, tasks: Task[], rewards: Reward[]) => {
  return await apiRequest('/data', 'POST', { progress, tasks, rewards });
};

export const fetchTasks = async (): Promise<Task[]> => {
  const tasks = await apiRequest('/tasks');
  return tasks.map((task: any) => ({
    ...task,
    dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    createdAt: new Date(task.createdAt),
  }));
};

export const createTask = async (task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
  const createdTask = await apiRequest('/tasks', 'POST', task);
  return {
    ...createdTask,
    dueDate: createdTask.dueDate ? new Date(createdTask.dueDate) : undefined,
    createdAt: new Date(createdTask.createdAt),
  };
};

export const updateTask = async (task: Task): Promise<Task> => {
  const updatedTask = await apiRequest(`/tasks/${task.id}`, 'PUT', task);
  return {
    ...updatedTask,
    dueDate: updatedTask.dueDate ? new Date(updatedTask.dueDate) : undefined,
    createdAt: new Date(updatedTask.createdAt),
  };
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await apiRequest(`/tasks/${taskId}`, 'DELETE');
};

export const fetchProgress = async (): Promise<UserProgress> => {
  return await apiRequest('/progress');
};

export const updateProgress = async (progress: UserProgress): Promise<UserProgress> => {
  return await apiRequest('/progress', 'PUT', progress);
};

export const fetchRewards = async (): Promise<Reward[]> => {
  return await apiRequest('/rewards');
};

export const updateReward = async (reward: Reward): Promise<Reward> => {
  return await apiRequest(`/rewards/${reward.id}`, 'PUT', reward);
};
