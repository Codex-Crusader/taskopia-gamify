
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { UserProgress, Task, Reward } from '@/types';
import { generateInitialProgress, updateProgressAfterTask } from '@/lib/gameLogic';
import { useToast } from '@/hooks/use-toast';
import TaskCard from '@/components/TaskCard';
import RewardBadge from '@/components/RewardBadge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Award, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'tasklevels-data';

// Helper to save data to localStorage
const saveData = (progress: UserProgress, tasks: Task[], rewards: Reward[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ progress, tasks, rewards }));
};

// Initial rewards
const initialRewards: Reward[] = [
  {
    id: '1',
    title: 'Task Master',
    description: 'Complete your first 5 tasks',
    image: '',
    requiredLevel: 1,
    unlocked: false,
  },
  {
    id: '2',
    title: 'Rising Star',
    description: 'Reach Level 2 for the first time',
    image: '',
    requiredLevel: 2,
    unlocked: false,
  },
  {
    id: '3',
    title: 'Productivity Pro',
    description: 'Complete 3 high priority tasks',
    image: '',
    requiredLevel: 3,
    unlocked: false,
  },
  {
    id: '4',
    title: 'Consistency King',
    description: 'Maintain a 5-day streak',
    image: '',
    requiredLevel: 5,
    unlocked: false,
  },
];

const Dashboard = () => {
  const [progress, setProgress] = useState<UserProgress>(generateInitialProgress());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rewards, setRewards] = useState<Reward[]>(initialRewards);
  const { toast } = useToast();
  
  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const { progress: savedProgress, tasks: savedTasks, rewards: savedRewards } = JSON.parse(savedData);
      setProgress(savedProgress);
      setTasks(savedTasks.map((task: any) => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        createdAt: new Date(task.createdAt),
      })));
      setRewards(savedRewards);
    }
  }, []);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    saveData(progress, tasks, rewards);
  }, [progress, tasks, rewards]);
  
  const handleCompleteTask = (task: Task) => {
    if (task.completed) return;
    
    const updatedTasks = tasks.map(t => 
      t.id === task.id ? { ...t, completed: true } : t
    );
    
    const updatedProgress = updateProgressAfterTask(progress, task);
    
    // Check if user leveled up
    const leveledUp = updatedProgress.level > progress.level;
    
    setTasks(updatedTasks);
    setProgress(updatedProgress);
    
    // Show toast notification
    if (leveledUp) {
      toast({
        title: "Level Up!",
        description: `Congratulations! You've reached Level ${updatedProgress.level}!`,
        variant: 'default',
      });
    } else {
      toast({
        title: "Task Completed!",
        description: `You earned ${task.points} points!`,
        variant: 'default',
      });
    }
    
    // Update rewards based on new progress
    const updatedRewards = rewards.map(reward => {
      if (!reward.unlocked && updatedProgress.level >= reward.requiredLevel) {
        // If this is a newly unlocked reward, show a toast
        toast({
          title: "New Reward Unlocked!",
          description: `You've unlocked: ${reward.title}`,
          variant: 'default',
        });
        return { ...reward, unlocked: true };
      }
      return reward;
    });
    
    setRewards(updatedRewards);
  };
  
  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };
  
  // Get incomplete tasks sorted by priority
  const incompleteTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 3);
  
  // Get recently completed tasks
  const recentlyCompletedTasks = tasks
    .filter(task => task.completed)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 2);
  
  // Get unlocked rewards
  const unlockedRewards = rewards
    .filter(reward => progress.level >= reward.requiredLevel)
    .slice(0, 2);
  
  return (
    <DashboardLayout progress={progress}>
      <div className="page-transition space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to TaskLevels</h1>
          <p className="text-muted-foreground">
            Complete tasks, earn points, and level up!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Tasks To Complete
              </CardTitle>
              <CardDescription>Your current tasks</CardDescription>
            </CardHeader>
            <CardContent>
              {incompleteTasks.length > 0 ? (
                <div className="space-y-4">
                  {incompleteTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onComplete={handleCompleteTask}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    asChild
                  >
                    <Link to="/tasks">View All Tasks</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No tasks yet</p>
                  <Button asChild>
                    <Link to="/tasks">Create a Task</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-reward" />
                  Rewards
                </CardTitle>
                <CardDescription>Your unlocked achievements</CardDescription>
              </CardHeader>
              <CardContent>
                {unlockedRewards.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {unlockedRewards.map(reward => (
                      <RewardBadge
                        key={reward.id}
                        reward={reward}
                        userLevel={progress.level}
                      />
                    ))}
                    
                    <Button 
                      variant="outline" 
                      className="w-full col-span-2 mt-2"
                      asChild
                    >
                      <Link to="/rewards">View All Rewards</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Complete tasks to unlock rewards
                    </p>
                    <Button asChild>
                      <Link to="/rewards">View Available Rewards</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Recently completed tasks</CardDescription>
              </CardHeader>
              <CardContent>
                {recentlyCompletedTasks.length > 0 ? (
                  <div className="space-y-3">
                    {recentlyCompletedTasks.map(task => (
                      <div 
                        key={task.id} 
                        className="flex items-center p-3 rounded-lg bg-secondary/50"
                      >
                        <CheckCircle className="h-5 w-5 text-primary mr-3" />
                        <div>
                          <p className="font-medium line-through">{task.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Completed • {task.points} points earned
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-muted-foreground">
                    No completed tasks yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
