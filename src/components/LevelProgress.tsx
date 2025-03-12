
import React from 'react';
import { UserProgress } from '@/types';
import { calculateLevelProgress } from '@/lib/gameLogic';
import { Trophy, Star, Zap, Sparkles, Award, Crown, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface LevelProgressProps {
  progress: UserProgress;
}

const LevelProgress: React.FC<LevelProgressProps> = ({ progress }) => {
  const levelPercentage = calculateLevelProgress(progress.points);
  
  // Level badge colors that get more vibrant as you level up
  const getBadgeColors = (level: number) => {
    const colors = [
      'bg-purple-300 dark:bg-purple-700', // Level 1
      'bg-purple-400 dark:bg-purple-600', // Level 2
      'bg-purple-500 dark:bg-purple-500', // Level 3
      'bg-purple-600 dark:bg-purple-400', // Level 4
      'bg-gradient-to-br from-purple-500 to-pink-500', // Level 5
      'bg-gradient-to-br from-purple-500 to-blue-500', // Level 6
      'bg-gradient-to-br from-blue-500 to-teal-500', // Level 7
      'bg-gradient-to-br from-teal-500 to-green-500', // Level 8
      'bg-gradient-to-br from-orange-500 to-yellow-500', // Level 9
      'bg-gradient-to-br from-red-500 to-purple-500', // Level 10+
    ];
    
    return level > colors.length ? colors[colors.length - 1] : colors[level - 1];
  };
  
  // Level icons that change as you level up
  const getLevelIcon = (level: number) => {
    if (level >= 10) return <Crown className="h-6 w-6 text-white" />;
    if (level >= 8) return <Sparkles className="h-6 w-6 text-white" />;
    if (level >= 6) return <Award className="h-6 w-6 text-white" />;
    if (level >= 4) return <Trophy className="h-6 w-6 text-white" />;
    if (level >= 2) return <Star className="h-6 w-6 text-white" />;
    return <Zap className="h-6 w-6 text-white" />;
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6 w-full transition-all duration-300 hover:shadow-lg border border-primary/20 dark:border-primary/10"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className={`level-badge w-12 h-12 text-lg animate-pulse-soft ${getBadgeColors(progress.level)}`}>
            {getLevelIcon(progress.level)}
          </div>
          <div>
            <h3 className="text-lg font-semibold">Level {progress.level}</h3>
            <p className="text-sm text-muted-foreground">
              {progress.points} / {progress.nextLevelPoints} points
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-vibrant-green" />
          <span className="text-sm font-medium">
            {progress.tasksCompleted} tasks completed
          </span>
        </div>
      </div>
      
      <div className="progress-bg overflow-hidden">
        <motion.div 
          className="progress-bar"
          initial={{ width: '0%' }}
          animate={{ width: `${levelPercentage}%` }}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </div>
      
      <div className="mt-4 flex justify-between items-center text-xs">
        <span className="text-muted-foreground">
          Current: Level {progress.level}
        </span>
        <span className="text-primary font-medium">
          {Math.floor(progress.nextLevelPoints - progress.points)} points until Level {progress.level + 1}
        </span>
      </div>
      
      {/* Add level milestones */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="text-xs font-medium mb-2">Level Milestones:</div>
        <div className="grid grid-cols-5 gap-1">
          {[1, 2, 3, 4, 5].map(level => (
            <motion.div 
              key={level} 
              className={`h-1.5 rounded-full ${progress.level >= level ? 'bg-primary' : 'bg-muted'}`}
              initial={{ width: '0%', opacity: 0 }}
              animate={{ width: '100%', opacity: 1 }}
              transition={{ duration: 0.5, delay: level * 0.1 }}
            ></motion.div>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-1 mt-1">
          {[6, 7, 8, 9, 10].map(level => (
            <motion.div 
              key={level} 
              className={`h-1.5 rounded-full ${progress.level >= level ? 'bg-primary' : 'bg-muted'}`}
              initial={{ width: '0%', opacity: 0 }}
              animate={{ width: '100%', opacity: 1 }}
              transition={{ duration: 0.5, delay: level * 0.1 }}
            ></motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LevelProgress;
