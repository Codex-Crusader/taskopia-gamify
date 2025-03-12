
import React from 'react';
import { Reward } from '@/types';
import { Lock, Unlock } from 'lucide-react';

interface RewardBadgeProps {
  reward: Reward;
  userLevel: number;
}

const RewardBadge: React.FC<RewardBadgeProps> = ({ reward, userLevel }) => {
  const isAvailable = userLevel >= reward.requiredLevel;
  
  return (
    <div className={`reward-card ${isAvailable ? 'animate-scale-in' : 'opacity-70'}`}>
      <div className="absolute top-3 right-3">
        {isAvailable ? (
          <Unlock className="h-5 w-5 text-green-500" />
        ) : (
          <Lock className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
      
      <div className="h-24 w-24 mx-auto mb-4 rounded-full overflow-hidden bg-accent/30 flex items-center justify-center">
        {reward.image ? (
          <img 
            src={reward.image} 
            alt={reward.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full text-accent-foreground">
            {reward.title.charAt(0)}
          </div>
        )}
      </div>
      
      <h3 className="text-xl font-semibold text-center mb-2">{reward.title}</h3>
      
      <p className="text-sm text-center text-muted-foreground mb-4">
        {reward.description}
      </p>
      
      <div className="text-xs text-center font-medium">
        {isAvailable ? (
          <span className="text-green-600">Unlocked!</span>
        ) : (
          <span>Reach Level {reward.requiredLevel} to unlock</span>
        )}
      </div>
    </div>
  );
};

export default RewardBadge;
