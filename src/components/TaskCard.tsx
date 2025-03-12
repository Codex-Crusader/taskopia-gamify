
import React from 'react';
import { Task } from '@/types';
import { CheckCircle, Clock, CalendarDays, Trophy, AlertTriangle, ArrowRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onComplete: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, onDelete }) => {
  // Priority color enhancement with dark mode support
  const priorityColors = {
    low: 'from-green-100 to-green-50 border-green-200 dark:from-green-900/40 dark:to-green-800/30 dark:border-green-800/50',
    medium: 'from-yellow-100 to-yellow-50 border-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/30 dark:border-yellow-800/50',
    high: 'from-red-100 to-red-50 border-red-200 dark:from-red-900/40 dark:to-red-800/30 dark:border-red-800/50',
    completed: 'from-purple-100 to-purple-50 border-purple-200 dark:from-purple-900/40 dark:to-purple-800/30 dark:border-purple-800/50'
  };
  
  const priorityIcons = {
    low: <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />,
    medium: <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />,
    high: <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
  };
  
  const priorityClass = task.completed 
    ? priorityColors.completed
    : priorityColors[task.priority];
  
  const formatDate = (date: Date) => {
    return format(date, 'MMM d');
  };
  
  return (
    <motion.div 
      className={cn(
        "task-card border bg-gradient-to-br animate-slide-up overflow-hidden",
        priorityClass
      )}
      style={{ animationDelay: `${Math.random() * 0.5}s` }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span 
            className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium gap-1",
              task.priority === 'low' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 
              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' :
              'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
            )}
          >
            {priorityIcons[task.priority]}
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
          
          <span className="flex items-center text-xs text-muted-foreground">
            <Trophy className="h-3 w-3 mr-1" />
            {task.points} pts
          </span>
        </div>
        
        {task.dueDate && (
          <span className="flex items-center text-xs text-muted-foreground">
            <CalendarDays className="h-3 w-3 mr-1" />
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>
      
      <h3 className={cn(
        "text-lg font-medium mb-1", 
        task.completed ? 'line-through text-muted-foreground' : ''
      )}>
        {task.title}
      </h3>
      
      <p className={cn(
        "text-sm mb-4", 
        task.completed ? 'text-muted-foreground' : ''
      )}>
        {task.description}
      </p>
      
      <div className="flex justify-between items-center mt-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1"
          onClick={() => onDelete(task.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </Button>
        
        {!task.completed && (
          <Button 
            variant="outline"
            size="sm"
            className="gap-1 bg-white/50 hover:bg-white/80 dark:bg-gray-800/50 dark:hover:bg-gray-800/80"
            onClick={() => onComplete(task)}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Complete
          </Button>
        )}
      </div>
      
      {/* Add a subtle glow effect for high priority tasks */}
      {task.priority === 'high' && !task.completed && (
        <div className="absolute -inset-0.5 bg-red-400 dark:bg-red-600 opacity-20 blur-sm rounded-xl animate-pulse-soft pointer-events-none"></div>
      )}
    </motion.div>
  );
};

export default TaskCard;
