
import React from 'react';
import { Reward } from '@/types';
import { Lock, Unlock, Trophy, Award, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RewardBadgeProps {
  reward: Reward;
  userLevel: number;
}

const RewardBadge: React.FC<RewardBadgeProps> = ({ reward, userLevel }) => {
  const isAvailable = userLevel >= reward.requiredLevel;
  
  // Generate gradients based on reward type or ID for visual diversity
  const gradientClasses = [
    'from-orange-300 to-orange-100',
    'from-purple-300 to-purple-100',
    'from-blue-300 to-blue-100',
    'from-green-300 to-green-100',
    'from-pink-300 to-pink-100'
  ];
  
  const gradientClass = gradientClasses[parseInt(reward.id) % gradientClasses.length];
  
  return (
    <div 
      className={cn(
        'reward-card bg-gradient-to-br', 
        gradientClass,
        isAvailable ? 'animate-scale-in' : 'opacity-70'
      )}
    >
      <div className="absolute top-3 right-3">
        {isAvailable ? (
          <Unlock className="h-5 w-5 text-green-500" />
        ) : (
          <Lock className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
      
      <div className="h-24 w-24 mx-auto mb-4 rounded-full overflow-hidden flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 animate-pulse-soft"></div>
        {reward.image ? (
          <img 
            src={reward.image} 
            alt={reward.title} 
            className="w-full h-full object-cover relative z-10"
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full text-primary relative z-10">
            {reward.requiredLevel <= 2 ? (
              <Trophy className="h-12 w-12 text-reward" />
            ) : reward.requiredLevel <= 4 ? (
              <Award className="h-12 w-12 text-reward" />
            ) : (
              <Star className="h-12 w-12 text-reward" />
            )}
          </div>
        )}
      </div>
      
      <h3 className="text-xl font-semibold text-center mb-2">{reward.title}</h3>
      
      <p className="text-sm text-center text-muted-foreground mb-4">
        {reward.description}
      </p>
      
      <div className="text-xs text-center font-medium">
        {isAvailable ? (
          <span className="text-green-600 flex items-center justify-center gap-1">
            <Award className="h-4 w-4" />
            Unlocked!
          </span>
        ) : (
          <span className="flex items-center justify-center gap-1">
            <Trophy className="h-4 w-4 text-muted-foreground" />
            Reach Level {reward.requiredLevel} to unlock
          </span>
        )}
      </div>
    </div>
  );
};

export default RewardBadge;
