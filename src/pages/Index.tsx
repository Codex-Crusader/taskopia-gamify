
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { UserProgress, Task, Reward } from '@/types';
import { generateInitialProgress, updateProgressAfterTask } from '@/lib/gameLogic';
import { useToast } from '@/hooks/use-toast';
import TaskCard from '@/components/TaskCard';
import RewardBadge from '@/components/RewardBadge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Award, TrendingUp, Calendar, Trophy, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const STORAGE_KEY = 'tasklevels-data';

// Helper to save data to localStorage
const saveData = (progress: UserProgress, tasks: Task[], rewards: Reward[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ progress, tasks, rewards }));
};

// Initial rewards with enhanced descriptions
const initialRewards: Reward[] = [
  {
    id: '1',
    title: 'Task Master',
    description: 'Complete your first 5 tasks and start your productivity journey!',
    image: '',
    requiredLevel: 1,
    unlocked: false,
  },
  {
    id: '2',
    title: 'Rising Star',
    description: 'Reach Level 2 and prove your commitment to growth!',
    image: '',
    requiredLevel: 2,
    unlocked: false,
  },
  {
    id: '3',
    title: 'Productivity Pro',
    description: 'Complete 3 high priority tasks and master difficult challenges!',
    image: '',
    requiredLevel: 3,
    unlocked: false,
  },
  {
    id: '4',
    title: 'Consistency King',
    description: 'Maintain a 5-day streak and build lasting habits!',
    image: '',
    requiredLevel: 5,
    unlocked: false,
  },
  {
    id: '5',
    title: 'Goal Crusher',
    description: 'Complete 10 tasks in a single week!',
    image: '',
    requiredLevel: 4,
    unlocked: false,
  },
  {
    id: '6',
    title: 'Productivity Legend',
    description: 'Reach Level 10 and achieve productivity mastery!',
    image: '',
    requiredLevel: 10,
    unlocked: false,
  },
];

// Achievement types to track different accomplishments
const achievementTypes = [
  { type: 'tasks_completed', label: 'Tasks Completed', icon: <CheckCircle className="h-5 w-5 text-green-500" /> },
  { type: 'level_reached', label: 'Level Reached', icon: <Star className="h-5 w-5 text-yellow-500" /> },
  { type: 'rewards_unlocked', label: 'Rewards Unlocked', icon: <Trophy className="h-5 w-5 text-reward" /> },
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
  
  // Get all unlocked rewards count for achievements
  const unlockedRewardsCount = rewards.filter(reward => 
    progress.level >= reward.requiredLevel
  ).length;
  
  // Get completed tasks count
  const completedTasksCount = tasks.filter(task => task.completed).length;
  
  // Calculate achievements stats
  const achievementStats = [
    { 
      type: 'tasks_completed', 
      current: completedTasksCount,
      total: 50,
      percentage: Math.min(Math.round((completedTasksCount / 50) * 100), 100)
    },
    { 
      type: 'level_reached', 
      current: progress.level,
      total: 10,
      percentage: Math.min(Math.round((progress.level / 10) * 100), 100)
    },
    { 
      type: 'rewards_unlocked', 
      current: unlockedRewardsCount,
      total: rewards.length,
      percentage: Math.min(Math.round((unlockedRewardsCount / rewards.length) * 100), 100)
    },
  ];
  
  return (
    <DashboardLayout progress={progress}>
      <div className="page-transition space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-yellow-500 animate-pulse-soft" />
            Welcome to TaskLevels
          </h1>
          <p className="text-muted-foreground">
            Complete tasks, earn points, and level up your productivity!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-l-4 border-l-primary shadow-md hover:shadow-lg transition-all duration-300">
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
                  {incompleteTasks.map((task, index) => (
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
            <Card className="border-l-4 border-l-reward shadow-md hover:shadow-lg transition-all duration-300">
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
            
            <Card className="border-l-4 border-l-green-500 shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
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
                        className="flex items-center p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors"
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
        
        {/* New Achievement Trophy Section */}
        <Card className="border-l-4 border-l-yellow-500 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Achievement Trophies
            </CardTitle>
            <CardDescription>Track your progress across different achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievementStats.map((achievement, index) => {
                const achievementType = achievementTypes.find(at => at.type === achievement.type);
                
                return (
                  <div 
                    key={achievement.type}
                    className="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-md rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {achievementType?.icon}
                      <h3 className="font-medium">{achievementType?.label}</h3>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span>{achievement.current}</span>
                      <span className="text-muted-foreground">/ {achievement.total}</span>
                    </div>
                    
                    <div className="w-full bg-secondary rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-yellow-300 to-yellow-500 h-2.5 rounded-full"
                        style={{ width: `${achievement.percentage}%` }}
                      ></div>
                    </div>
                    
                    <p className="text-xs text-center mt-2 text-muted-foreground">
                      {achievement.percentage}% Complete
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
