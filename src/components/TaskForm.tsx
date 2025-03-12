
import React, { useState } from 'react';
import { Priority, Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateTaskPoints } from '@/lib/gameLogic';
import { Calendar, Plus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';

interface TaskFormProps {
  onAddTask: (task: Task) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      priority,
      dueDate,
      completed: false,
      createdAt: new Date(),
      points: calculateTaskPoints(priority),
    };
    
    onAddTask(newTask);
    
    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate(undefined);
    setIsOpen(false);
  };
  
  return (
    <div className="mb-6">
      {isOpen ? (
        <div className="glass rounded-xl p-6 animate-scale-in">
          <form onSubmit={handleSubmit}>
            <h3 className="text-lg font-semibold mb-4">Create New Task</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Task Title
                </label>
                <Input
                  id="title"
                  placeholder="What needs to be done?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description (optional)
                </label>
                <Textarea
                  id="description"
                  placeholder="Add more details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="resize-none"
                />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor="priority" className="block text-sm font-medium mb-1">
                    Priority
                  </label>
                  <Select
                    value={priority}
                    onValueChange={(value: Priority) => setPriority(value)}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Due Date (optional)
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        {dueDate ? format(dueDate, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={dueDate}
                        onSelect={setDueDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Task</Button>
            </div>
          </form>
        </div>
      ) : (
        <Button
          className="w-full py-6 border-dashed border-2 bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-300"
          variant="outline"
          onClick={() => setIsOpen(true)}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Task
        </Button>
      )}
    </div>
  );
};

export default TaskForm;
