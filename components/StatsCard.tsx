'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  index?: number;
}

export function StatsCard({ title, value, icon: Icon, trend, description, index = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -2 }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</p>
              <motion.p
                className="text-2xl sm:text-3xl font-bold mt-1"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
              >
                {value}
              </motion.p>
              {(trend || description) && (
                <div className="flex items-center gap-1 mt-1">
                  {trend && (
                    <span className={cn(
                      'flex items-center text-xs font-medium',
                      trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                    )}>
                      {trend.isPositive ? (
                        <TrendingUp className="h-3 w-3 mr-0.5" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-0.5" />
                      )}
                      {trend.value > 0 ? '+' : ''}{trend.value}
                    </span>
                  )}
                  {description && (
                    <span className="text-xs text-muted-foreground">{description}</span>
                  )}
                </div>
              )}
            </div>
            <div className="rounded-lg gradient-subtle p-2 sm:p-2.5">
              <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
