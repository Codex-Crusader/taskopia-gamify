
import React from 'react';
import { Task } from '@/types';
import { CheckCircle, Clock, CalendarDays, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { calculateTaskPoints } from '@/lib/gameLogic';

interface TaskCardProps {
  task: Task;
  onComplete: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, onDelete }) => {
  const priorityClass = task.completed 
    ? 'task-complete' 
    : `task-priority-${task.priority}`;
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  return (
    <div 
      className={`task-card ${priorityClass} animate-slide-up`}
      style={{ animationDelay: `${Math.random() * 0.5}s` }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span 
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${task.priority === 'low' ? 'bg-task-low/20 text-green-800' : 
                task.priority === 'medium' ? 'bg-task-medium/20 text-yellow-800' :
                'bg-task-high/20 text-red-800'}`}
          >
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
      
      <h3 className={`text-lg font-medium mb-1 ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
        {task.title}
      </h3>
      
      <p className={`text-sm mb-4 ${task.completed ? 'text-muted-foreground' : ''}`}>
        {task.description}
      </p>
      
      <div className="flex justify-between items-center mt-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </Button>
        
        {!task.completed && (
          <Button 
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => onComplete(task)}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Complete
          </Button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
