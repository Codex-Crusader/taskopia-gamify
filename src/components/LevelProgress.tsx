
import React from 'react';
import { UserProgress } from '@/types';
import { calculateLevelProgress } from '@/lib/gameLogic';
import { Trophy } from 'lucide-react';

interface LevelProgressProps {
  progress: UserProgress;
}

const LevelProgress: React.FC<LevelProgressProps> = ({ progress }) => {
  const levelPercentage = calculateLevelProgress(progress.points);
  
  return (
    <div className="glass rounded-2xl p-6 w-full transition-all duration-300 hover:shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="level-badge w-12 h-12 text-lg animate-pulse-soft">
            {progress.level}
          </div>
          <div>
            <h3 className="text-lg font-semibold">Level {progress.level}</h3>
            <p className="text-sm text-muted-foreground">
              {progress.points} / {progress.nextLevelPoints} points
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-level" />
          <span className="text-sm font-medium">
            {progress.tasksCompleted} tasks completed
          </span>
        </div>
      </div>
      
      <div className="progress-bg">
        <div 
          className="progress-bar"
          style={{ width: `${levelPercentage}%` }}
        />
      </div>
      
      <div className="mt-4 text-xs text-muted-foreground text-center">
        {Math.floor(progress.nextLevelPoints - progress.points)} points until Level {progress.level + 1}
      </div>
    </div>
  );
};

export default LevelProgress;
