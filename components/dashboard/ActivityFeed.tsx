'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, ActivityType } from '@/types';
import { cn } from '@/lib/utils';
import {
  Mail,
  MessageCircle,
  Calendar,
  Clock,
  Plus,
  Gift,
} from 'lucide-react';

interface ActivityFeedProps {
  activities: Activity[];
}

const activityIcons: Record<ActivityType, typeof Mail> = {
  email_sent: Mail,
  response_received: MessageCircle,
  interview_scheduled: Calendar,
  followup_scheduled: Clock,
  application_created: Plus,
  offer_received: Gift,
};

const activityColors: Record<ActivityType, string> = {
  email_sent: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  response_received: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  interview_scheduled: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  followup_scheduled: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  application_created: 'bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400',
  offer_received: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {activities.map((activity, index) => {
          const Icon = activityIcons[activity.type];
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'flex items-start gap-3 p-2 sm:p-3 rounded-lg transition-colors',
                index >= 3 && 'hidden sm:flex',
                activity.isHighlighted 
                  ? 'bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800' 
                  : 'hover:bg-muted/50'
              )}
            >
              <div className={cn('p-2 rounded-lg', activityColors[activity.type])}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn('font-medium text-sm', activity.isHighlighted && 'text-emerald-700 dark:text-emerald-400')}>
                  {activity.title}
                </p>
                <p className="hidden sm:block text-xs text-muted-foreground mt-0.5">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activity.companyName} • {formatTimestamp(activity.timestamp)}
                </p>
              </div>
              {activity.isHighlighted && (
                <span className="text-emerald-500 text-lg">🎉</span>
              )}
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
