
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { UserProgress, Task } from '@/types';
import { generateInitialProgress, updateProgressAfterTask } from '@/lib/gameLogic';
import HealthyHabits from '@/components/HealthyHabits';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Lightbulb, ListTodo } from 'lucide-react';
import { motion } from 'framer-motion';
import TaskCard from '@/components/TaskCard';

const STORAGE_KEY = 'tasklevels-data';

const HabitsPage = () => {
  const [progress, setProgress] = useState<UserProgress>(generateInitialProgress());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rewards, setRewards] = useState<any[]>([]);
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
    if (tasks.length > 0 || progress.points > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ progress, tasks, rewards }));
    }
  }, [progress, tasks, rewards]);
  
  const handleAddTask = (task: Task) => {
    setTasks([task, ...tasks]);
    
    toast({
      title: "Healthy Habit Added",
      description: `"${task.title}" has been added to your tasks.`,
      variant: 'default',
    });
  };
  
  const handleCompleteTask = (task: Task) => {
    if (task.completed) return;
    
    const updatedTasks = tasks.map(t => 
      t.id === task.id ? { ...t, completed: true } : t
    );
    
    const updatedProgress = updateProgressAfterTask(progress, task);
    
    setTasks(updatedTasks);
    setProgress(updatedProgress);
    
    // Show toast notification
    toast({
      title: "Habit Completed!",
      description: `You earned ${task.points} points!`,
      variant: 'default',
    });
  };
  
  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    
    toast({
      title: "Task Deleted",
      description: "The task has been removed.",
      variant: 'default',
    });
  };
  
  // Get health-related tasks (created from healthy habits)
  const healthTasks = tasks
    .filter(task => !task.completed)
    .slice(0, 4);
  
  return (
    <DashboardLayout progress={progress}>
      <div className="page-transition space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Heart className="h-8 w-8 text-green-500 animate-pulse-soft" />
            Healthy Habits
          </h1>
          <p className="text-muted-foreground">
            Improve your wellbeing by incorporating these healthy habits into your daily routine
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <HealthyHabits onAddTask={handleAddTask} />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card className="border-l-4 border-l-amber-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    Habit Formation Tips
                  </CardTitle>
                  <CardDescription>
                    Tips to help you build lasting habits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5">1</span>
                      <span>Start with small, achievable habits to build momentum</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5">2</span>
                      <span>Be consistent - do the habit at the same time each day</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5">3</span>
                      <span>Track your progress to stay motivated</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5">4</span>
                      <span>Stack habits - attach new habits to existing routines</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5">5</span>
                      <span>Celebrate small wins to reinforce positive behavior</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListTodo className="h-5 w-5 text-blue-500" />
                  Your Active Health Tasks
                </CardTitle>
                <CardDescription>
                  Health-related tasks you're currently working on
                </CardDescription>
              </CardHeader>
              <CardContent>
                {healthTasks.length > 0 ? (
                  <div className="space-y-4">
                    {healthTasks.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onComplete={handleCompleteTask}
                        onDelete={handleDeleteTask}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Add some healthy habits to get started!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HabitsPage;
