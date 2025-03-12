
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { UserProgress, Task } from '@/types';
import { generateInitialProgress, updateProgressAfterTask } from '@/lib/gameLogic';
import TaskForm from '@/components/TaskForm';
import TaskCard from '@/components/TaskCard';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const STORAGE_KEY = 'tasklevels-data';

type SortOption = 'priority' | 'dueDate' | 'createdAt';
type FilterPriority = 'all' | 'low' | 'medium' | 'high';

const TasksPage = () => {
  const [progress, setProgress] = useState<UserProgress>(generateInitialProgress());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rewards, setRewards] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [sortBy, setSortBy] = useState<SortOption>('priority');
  const [filterPriority, setFilterPriority] = useState<FilterPriority>('all');
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
      title: "Task Created",
      description: "Your new task has been added.",
      variant: 'default',
    });
  };
  
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
    
    // Update rewards (same as in Index.tsx, but simplified here)
    const updatedRewards = rewards.map(reward => {
      if (!reward.unlocked && updatedProgress.level >= reward.requiredLevel) {
        return { ...reward, unlocked: true };
      }
      return reward;
    });
    
    setRewards(updatedRewards);
  };
  
  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    
    toast({
      title: "Task Deleted",
      description: "The task has been removed.",
      variant: 'default',
    });
  };
  
  // Filter and sort tasks
  const filteredTasks = tasks.filter(task => {
    // First filter by active/completed status
    const statusMatch = 
      (activeTab === 'active' && !task.completed) || 
      (activeTab === 'completed' && task.completed);
    
    // Then filter by priority if needed
    const priorityMatch = 
      filterPriority === 'all' || 
      task.priority === filterPriority;
    
    return statusMatch && priorityMatch;
  });
  
  // Sort the filtered tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    } else if (sortBy === 'dueDate') {
      // Handle tasks without due dates (they go to the end)
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.getTime() - b.dueDate.getTime();
    } else {
      // Sort by created date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });
  
  return (
    <DashboardLayout progress={progress}>
      <div className="page-transition space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Tasks</h1>
          
          <div className="flex gap-2">
            <Select
              value={sortBy}
              onValueChange={(value: SortOption) => setSortBy(value)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="createdAt">Date Created</SelectItem>
              </SelectContent>
            </Select>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuCheckboxItem
                  checked={filterPriority === 'all'}
                  onCheckedChange={() => setFilterPriority('all')}
                >
                  All Priorities
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterPriority === 'high'}
                  onCheckedChange={() => setFilterPriority('high')}
                >
                  High Priority
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterPriority === 'medium'}
                  onCheckedChange={() => setFilterPriority('medium')}
                >
                  Medium Priority
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterPriority === 'low'}
                  onCheckedChange={() => setFilterPriority('low')}
                >
                  Low Priority
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <TaskForm onAddTask={handleAddTask} />
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'active' | 'completed')}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="active">Active Tasks</TabsTrigger>
            <TabsTrigger value="completed">Completed Tasks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-4">
            {sortedTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={handleCompleteTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No active tasks found</p>
                <p className="text-sm">
                  {filterPriority !== 'all' 
                    ? `Try changing your priority filter or create a new ${filterPriority} priority task.`
                    : 'Create a new task to get started!'}
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            {sortedTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={handleCompleteTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No completed tasks yet</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TasksPage;
