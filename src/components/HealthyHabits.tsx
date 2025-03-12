
import React from 'react';
import { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Activity, Coffee, Droplet, Utensils, Moon, Sun, Brain, Watch, Bike } from 'lucide-react';
import { calculateTaskPoints } from '@/lib/gameLogic';
import { motion } from 'framer-motion';

interface HealthyHabitsProps {
  onAddTask: (task: Task) => void;
}

const HealthyHabits: React.FC<HealthyHabitsProps> = ({ onAddTask }) => {
  // List of predefined healthy habits with icons
  const healthyHabits = [
    {
      id: 1,
      title: "Drink 8 glasses of water",
      description: "Stay hydrated throughout the day",
      icon: <Droplet className="h-5 w-5 text-blue-500" />,
      priority: "medium" as const,
      category: "health"
    },
    {
      id: 2,
      title: "30-minute workout",
      description: "Do any form of exercise for 30 minutes",
      icon: <Activity className="h-5 w-5 text-green-500" />,
      priority: "high" as const,
      category: "fitness"
    },
    {
      id: 3,
      title: "Eat a balanced meal",
      description: "Include proteins, vegetables, and whole grains",
      icon: <Utensils className="h-5 w-5 text-orange-500" />,
      priority: "medium" as const,
      category: "nutrition"
    },
    {
      id: 4,
      title: "Get 8 hours of sleep",
      description: "Maintain a consistent sleep schedule",
      icon: <Moon className="h-5 w-5 text-indigo-500" />,
      priority: "high" as const,
      category: "rest"
    },
    {
      id: 5,
      title: "Practice meditation",
      description: "Spend 10 minutes meditating",
      icon: <Brain className="h-5 w-5 text-purple-500" />,
      priority: "low" as const,
      category: "mindfulness"
    },
    {
      id: 6,
      title: "Take a walking break",
      description: "Step away from screens for 10 minutes",
      icon: <Bike className="h-5 w-5 text-teal-500" />,
      priority: "low" as const,
      category: "movement"
    },
    {
      id: 7,
      title: "Morning stretching routine",
      description: "Stretch major muscle groups for 5-10 minutes",
      icon: <Sun className="h-5 w-5 text-yellow-500" />,
      priority: "medium" as const,
      category: "fitness"
    },
    {
      id: 8,
      title: "Limit caffeine after noon",
      description: "Switch to herbal tea or water",
      icon: <Coffee className="h-5 w-5 text-brown-500" />,
      priority: "low" as const,
      category: "health"
    },
    {
      id: 9,
      title: "Take vitamin supplements",
      description: "Don't forget your daily vitamins",
      icon: <Heart className="h-5 w-5 text-red-500" />,
      priority: "medium" as const,
      category: "health"
    },
    {
      id: 10,
      title: "Digital sunset (no screens 1h before bed)",
      description: "Improve sleep quality by avoiding blue light",
      icon: <Watch className="h-5 w-5 text-slate-500" />,
      priority: "medium" as const,
      category: "rest"
    },
  ];

  // Group habits by category
  const groupedHabits: { [key: string]: typeof healthyHabits } = {};
  healthyHabits.forEach(habit => {
    if (!groupedHabits[habit.category]) {
      groupedHabits[habit.category] = [];
    }
    groupedHabits[habit.category].push(habit);
  });

  const handleAddHabit = (habit: typeof healthyHabits[0]) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: habit.title,
      description: habit.description,
      priority: habit.priority,
      completed: false,
      createdAt: new Date(),
      points: calculateTaskPoints(habit.priority),
    };
    
    onAddTask(newTask);
  };

  // Animation variant for list items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1, 
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3
      }
    })
  };

  return (
    <Card className="border-l-4 border-l-green-500 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-green-500" />
          Healthy Habits
        </CardTitle>
        <CardDescription>
          Click on a habit to add it as a task
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedHabits).map(([category, habits], categoryIndex) => (
            <div key={category} className="space-y-2">
              <h3 className="text-sm font-medium capitalize">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {habits.map((habit, habitIndex) => (
                  <motion.div
                    key={habit.id}
                    custom={habitIndex}
                    initial="hidden"
                    animate="visible"
                    variants={itemVariants}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-3 px-4 bg-gradient-to-r from-white/80 to-white/30 hover:from-primary/10 hover:to-primary/5 dark:from-gray-800/80 dark:to-gray-800/30"
                      onClick={() => handleAddHabit(habit)}
                    >
                      <div className="mr-3">{habit.icon}</div>
                      <div className="text-left">
                        <p className="font-medium">{habit.title}</p>
                        <p className="text-xs text-muted-foreground">{habit.description}</p>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthyHabits;
