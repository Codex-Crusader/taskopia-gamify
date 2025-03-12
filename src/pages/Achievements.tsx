
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { UserProgress, Reward, Task } from '@/types';
import { generateInitialProgress } from '@/lib/gameLogic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Star, Award, Crown, BadgeCheck, Target, Clock, Fire } from 'lucide-react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'tasklevels-data';

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  criteria: (tasks: Task[], progress: UserProgress, rewards: Reward[]) => {
    completed: boolean;
    progress: number;
    target: number;
    current: number;
  };
  colorClass: string;
};

const AchievementsPage = () => {
  const [progress, setProgress] = useState<UserProgress>(generateInitialProgress());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  
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
  
  // Define all possible achievements
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Task Master',
      description: 'Complete 10 tasks of any priority',
      icon: <Trophy className="h-8 w-8 text-yellow-500" />,
      colorClass: 'from-yellow-500 to-amber-500',
      criteria: (tasks) => {
        const completedTasks = tasks.filter(task => task.completed).length;
        return {
          completed: completedTasks >= 10,
          progress: Math.min(completedTasks / 10 * 100, 100),
          target: 10,
          current: completedTasks
        };
      }
    },
    {
      id: '2',
      title: 'High Achiever',
      description: 'Complete 5 high priority tasks',
      icon: <Fire className="h-8 w-8 text-red-500" />,
      colorClass: 'from-red-500 to-orange-500',
      criteria: (tasks) => {
        const completedHighPriorityTasks = tasks.filter(task => task.completed && task.priority === 'high').length;
        return {
          completed: completedHighPriorityTasks >= 5,
          progress: Math.min(completedHighPriorityTasks / 5 * 100, 100),
          target: 5,
          current: completedHighPriorityTasks
        };
      }
    },
    {
      id: '3',
      title: 'Level Up',
      description: 'Reach level 5',
      icon: <Star className="h-8 w-8 text-purple-500" />,
      colorClass: 'from-purple-500 to-indigo-500',
      criteria: (_, userProgress) => {
        return {
          completed: userProgress.level >= 5,
          progress: Math.min(userProgress.level / 5 * 100, 100),
          target: 5,
          current: userProgress.level
        };
      }
    },
    {
      id: '4',
      title: 'Healthy Habits',
      description: 'Complete 7 health-related tasks',
      icon: <BadgeCheck className="h-8 w-8 text-green-500" />,
      colorClass: 'from-green-500 to-emerald-500',
      criteria: (tasks) => {
        // For simplicity, we'll consider low priority tasks as health-related
        const healthTasks = tasks.filter(task => task.completed && task.priority === 'low').length;
        return {
          completed: healthTasks >= 7,
          progress: Math.min(healthTasks / 7 * 100, 100),
          target: 7,
          current: healthTasks
        };
      }
    },
    {
      id: '5',
      title: 'Reward Collector',
      description: 'Unlock 5 rewards',
      icon: <Medal className="h-8 w-8 text-amber-500" />,
      colorClass: 'from-amber-500 to-yellow-500',
      criteria: (_, __, userRewards) => {
        const unlockedRewards = userRewards.filter(reward => reward.unlocked).length;
        return {
          completed: unlockedRewards >= 5,
          progress: Math.min(unlockedRewards / 5 * 100, 100),
          target: 5,
          current: unlockedRewards
        };
      }
    },
    {
      id: '6',
      title: 'Balanced Life',
      description: 'Complete at least 3 tasks of each priority level',
      icon: <Target className="h-8 w-8 text-blue-500" />,
      colorClass: 'from-blue-500 to-cyan-500',
      criteria: (tasks) => {
        const completedByPriority = {
          low: tasks.filter(task => task.completed && task.priority === 'low').length,
          medium: tasks.filter(task => task.completed && task.priority === 'medium').length,
          high: tasks.filter(task => task.completed && task.priority === 'high').length,
        };
        
        const allMet = completedByPriority.low >= 3 && 
                        completedByPriority.medium >= 3 && 
                        completedByPriority.high >= 3;
        
        const minRequired = 3 * 3; // 3 of each priority = 9 total minimum
        const current = Math.min(completedByPriority.low, 3) + 
                         Math.min(completedByPriority.medium, 3) + 
                         Math.min(completedByPriority.high, 3);
        
        return {
          completed: allMet,
          progress: (current / minRequired) * 100,
          target: minRequired,
          current: current
        };
      }
    },
    {
      id: '7',
      title: 'Productivity Streak',
      description: 'Complete at least 5 tasks in a single day',
      icon: <Clock className="h-8 w-8 text-indigo-500" />,
      colorClass: 'from-indigo-500 to-purple-500',
      criteria: (tasks) => {
        // This is a simplified version - ideally would group by completion date
        // For now, we'll just check if user has completed 5+ tasks total
        const completedTasks = tasks.filter(task => task.completed).length;
        return {
          completed: completedTasks >= 5,
          progress: Math.min(completedTasks / 5 * 100, 100),
          target: 5,
          current: completedTasks
        };
      }
    },
    {
      id: '8',
      title: 'Task Wizard',
      description: 'Complete 25 tasks of any priority',
      icon: <Crown className="h-8 w-8 text-yellow-600" />,
      colorClass: 'from-yellow-600 to-amber-600',
      criteria: (tasks) => {
        const completedTasks = tasks.filter(task => task.completed).length;
        return {
          completed: completedTasks >= 25,
          progress: Math.min(completedTasks / 25 * 100, 100),
          target: 25,
          current: completedTasks
        };
      }
    },
    {
      id: '9',
      title: 'Habit Former',
      description: 'Complete the same task 3 days in a row',
      icon: <Award className="h-8 w-8 text-pink-500" />,
      colorClass: 'from-pink-500 to-rose-500',
      criteria: () => {
        // This is simplified - would require tracking daily task completions
        // For now, we'll make this one always in progress
        return {
          completed: false,
          progress: 33,
          target: 3,
          current: 1
        };
      }
    },
    {
      id: '10',
      title: 'Level 10 Master',
      description: 'Reach the maximum level of 10',
      icon: <Crown className="h-8 w-8 text-amber-600" />,
      colorClass: 'from-amber-600 to-yellow-600',
      criteria: (_, userProgress) => {
        return {
          completed: userProgress.level >= 10,
          progress: Math.min(userProgress.level / 10 * 100, 100),
          target: 10,
          current: userProgress.level
        };
      }
    },
  ];
  
  // Calculate achievement status
  const achievementsWithStatus = achievements.map(achievement => {
    const status = achievement.criteria(tasks, progress, rewards);
    return {
      ...achievement,
      ...status
    };
  });
  
  // Group achievements by completion status
  const completedAchievements = achievementsWithStatus.filter(a => a.completed);
  const inProgressAchievements = achievementsWithStatus.filter(a => !a.completed);
  
  const totalCompleted = completedAchievements.length;
  const totalAchievements = achievements.length;
  const overallProgress = (totalCompleted / totalAchievements) * 100;
  
  return (
    <DashboardLayout progress={progress}>
      <div className="page-transition space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-500 animate-pulse-soft" />
            Achievements
          </h1>
          <p className="text-muted-foreground">
            Track your progress and earn special achievements
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Overall Achievement Progress</CardTitle>
            <CardDescription>You've completed {totalCompleted} out of {totalAchievements} achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{totalCompleted} completed</span>
                <span>{totalAchievements - totalCompleted} remaining</span>
              </div>
              <Progress value={overallProgress} className="h-2.5" />
              <p className="text-xs text-muted-foreground text-right">
                {Math.round(overallProgress)}% complete
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Completed Achievements */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-green-500" />
              Completed
            </h2>
            
            {completedAchievements.length > 0 ? (
              <div className="space-y-4">
                {completedAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden border-0 shadow-md">
                      <div className={`h-2 bg-gradient-to-r ${achievement.colorClass}`} />
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className={`rounded-full p-3 bg-gradient-to-br ${achievement.colorClass} text-white`}>
                            {achievement.icon}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{achievement.title}</h3>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            <div className="mt-2 flex items-center">
                              <BadgeCheck className="h-4 w-4 text-green-500 mr-1" />
                              <span className="text-xs font-medium text-green-600">Completed!</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground py-8">
                    No achievements completed yet. Keep working on your tasks!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* In Progress Achievements */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              In Progress
            </h2>
            
            <div className="space-y-4">
              {inProgressAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden border border-muted">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="rounded-full p-3 bg-secondary text-muted-foreground">
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                          
                          <div className="space-y-1">
                            <Progress value={achievement.progress} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{achievement.current} / {achievement.target}</span>
                              <span>{Math.round(achievement.progress)}% complete</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AchievementsPage;
