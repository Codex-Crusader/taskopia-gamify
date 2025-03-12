
import React from 'react';
import { Task } from '@/types';
import { CheckCircle, Clock, CalendarDays, Trophy, AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onComplete: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, onDelete }) => {
  // Priority color enhancement
  const priorityColors = {
    low: 'from-green-100 to-green-50 border-green-200',
    medium: 'from-yellow-100 to-yellow-50 border-yellow-200',
    high: 'from-red-100 to-red-50 border-red-200',
    completed: 'from-purple-100 to-purple-50 border-purple-200'
  };
  
  const priorityIcons = {
    low: <CheckCircle className="h-4 w-4 text-green-600" />,
    medium: <Clock className="h-4 w-4 text-yellow-600" />,
    high: <AlertTriangle className="h-4 w-4 text-red-600" />
  };
  
  const priorityClass = task.completed 
    ? priorityColors.completed
    : priorityColors[task.priority];
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  return (
    <div 
      className={cn(
        "task-card border bg-gradient-to-br animate-slide-up",
        priorityClass
      )}
      style={{ animationDelay: `${Math.random() * 0.5}s` }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span 
            className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium gap-1",
              task.priority === 'low' ? 'bg-green-100 text-green-800' : 
              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
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
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </Button>
        
        {!task.completed && (
          <Button 
            variant="outline"
            size="sm"
            className="gap-1 bg-white/50 hover:bg-white/80"
            onClick={() => onComplete(task)}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Complete
          </Button>
        )}
      </div>
      
      {/* Add a subtle glow effect for high priority tasks */}
      {task.priority === 'high' && !task.completed && (
        <div className="absolute -inset-0.5 bg-red-400 opacity-20 blur-sm rounded-xl animate-pulse-soft pointer-events-none"></div>
      )}
    </div>
  );
};

export default TaskCard;
