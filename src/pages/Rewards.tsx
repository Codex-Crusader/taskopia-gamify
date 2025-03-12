
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { UserProgress, Reward } from '@/types';
import { generateInitialProgress } from '@/lib/gameLogic';
import RewardBadge from '@/components/RewardBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const STORAGE_KEY = 'tasklevels-data';

// Initial rewards (same as in Index.tsx)
const initialRewards: Reward[] = [
  {
    id: '1',
    title: 'Task Master',
    description: 'Complete your first 5 tasks',
    image: '',
    requiredLevel: 1,
    unlocked: false,
  },
  {
    id: '2',
    title: 'Rising Star',
    description: 'Reach Level 2 for the first time',
    image: '',
    requiredLevel: 2,
    unlocked: false,
  },
  {
    id: '3',
    title: 'Productivity Pro',
    description: 'Complete 3 high priority tasks',
    image: '',
    requiredLevel: 3,
    unlocked: false,
  },
  {
    id: '4',
    title: 'Consistency King',
    description: 'Maintain a 5-day streak',
    image: '',
    requiredLevel: 5,
    unlocked: false,
  },
  {
    id: '5',
    title: 'Goal Getter',
    description: 'Complete 10 tasks in total',
    image: '',
    requiredLevel: 4,
    unlocked: false,
  },
  {
    id: '6',
    title: 'Time Master',
    description: 'Complete all tasks before their due date for a week',
    image: '',
    requiredLevel: 6,
    unlocked: false,
  },
  {
    id: '7',
    title: 'Priority Expert',
    description: 'Complete 5 high priority tasks in a row',
    image: '',
    requiredLevel: 7,
    unlocked: false,
  },
  {
    id: '8',
    title: 'Planning Perfection',
    description: 'Create and complete tasks for 14 consecutive days',
    image: '',
    requiredLevel: 10,
    unlocked: false,
  },
];

const RewardsPage = () => {
  const [progress, setProgress] = useState<UserProgress>(generateInitialProgress());
  const [rewards, setRewards] = useState<Reward[]>(initialRewards);
  const [activeTab, setActiveTab] = useState<'unlocked' | 'locked'>('unlocked');
  
  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const { progress: savedProgress, rewards: savedRewards } = JSON.parse(savedData);
      setProgress(savedProgress);
      setRewards(savedRewards.length > 0 ? savedRewards : initialRewards);
    }
  }, []);
  
  // Filter rewards based on tab
  const unlockedRewards = rewards.filter(reward => progress.level >= reward.requiredLevel);
  const lockedRewards = rewards.filter(reward => progress.level < reward.requiredLevel);
  
  return (
    <DashboardLayout progress={progress}>
      <div className="page-transition space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Rewards & Achievements</h1>
          <p className="text-muted-foreground">
            Level up and complete tasks to unlock special rewards
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'unlocked' | 'locked')}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="unlocked">
              Unlocked ({unlockedRewards.length})
            </TabsTrigger>
            <TabsTrigger value="locked">
              Locked ({lockedRewards.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="unlocked">
            {unlockedRewards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {unlockedRewards.map(reward => (
                  <RewardBadge
                    key={reward.id}
                    reward={reward}
                    userLevel={progress.level}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-2">
                  You haven't unlocked any rewards yet
                </p>
                <p className="text-sm">
                  Complete tasks and level up to unlock rewards!
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="locked">
            {lockedRewards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {lockedRewards.map(reward => (
                  <RewardBadge
                    key={reward.id}
                    reward={reward}
                    userLevel={progress.level}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-2">
                  Congratulations! You've unlocked all available rewards!
                </p>
                <p className="text-sm">
                  Check back later for more achievements to unlock.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default RewardsPage;
