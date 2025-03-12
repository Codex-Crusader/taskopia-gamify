
import React from 'react';
import { Reward } from '@/types';
import { Lock, Unlock, Trophy, Award, Star, Medal, Crown, FlameIcon, Sparkles, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface RewardBadgeProps {
  reward: Reward;
  userLevel: number;
}

const RewardBadge: React.FC<RewardBadgeProps> = ({ reward, userLevel }) => {
  const isAvailable = userLevel >= reward.requiredLevel;
  
  // Enhanced gradients based on reward type or ID for visual diversity
  const gradientClasses = [
    'from-orange-300 to-yellow-100',
    'from-purple-400 to-pink-200',
    'from-blue-400 to-cyan-200',
    'from-green-400 to-emerald-200',
    'from-pink-400 to-rose-200',
    'from-indigo-400 to-blue-200',
    'from-amber-400 to-yellow-200',
    'from-teal-400 to-cyan-200',
    'from-fuchsia-400 to-pink-200',
    'from-lime-400 to-green-200',
  ];
  
  const gradientClass = gradientClasses[parseInt(reward.id) % gradientClasses.length];
  
  // Choose an icon based on the reward's ID or level requirement
  const getRewardIcon = () => {
    const icons = [
      <Trophy className="h-12 w-12 text-amber-500" />,
      <Award className="h-12 w-12 text-indigo-500" />,
      <Star className="h-12 w-12 text-yellow-500" />,
      <Medal className="h-12 w-12 text-red-500" />,
      <Crown className="h-12 w-12 text-amber-600" />,
      <FlameIcon className="h-12 w-12 text-orange-500" />,
      <Sparkles className="h-12 w-12 text-yellow-400" />,
      <Lightbulb className="h-12 w-12 text-amber-400" />
    ];
    return icons[parseInt(reward.id) % icons.length];
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: parseInt(reward.id) * 0.1 }}
      className={cn(
        'reward-card bg-gradient-to-br', 
        gradientClass,
        isAvailable ? 'animate-scale-in shadow-lg' : 'opacity-70'
      )}
    >
      <div className="absolute top-3 right-3">
        {isAvailable ? (
          <Unlock className="h-5 w-5 text-green-600" />
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
          <div className="flex items-center justify-center h-full w-full relative z-10">
            {getRewardIcon()}
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
    </motion.div>
  );
};

export default RewardBadge;
