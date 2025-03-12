
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Dashboard from '@/pages/Index';
import TasksPage from '@/pages/Tasks';
import RewardsPage from '@/pages/Rewards';
import HabitsPage from '@/pages/Habits';
import AchievementsPage from '@/pages/Achievements';
import NotFound from '@/pages/NotFound';
import ThemeProvider from '@/components/ThemeProvider';
import '@/index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />
  },
  {
    path: '/tasks',
    element: <TasksPage />
  },
  {
    path: '/rewards',
    element: <RewardsPage />
  },
  {
    path: '/habits',
    element: <HabitsPage />
  },
  {
    path: '/achievements',
    element: <AchievementsPage />
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  </React.StrictMode>
);
