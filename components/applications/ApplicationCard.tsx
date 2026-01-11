'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Application } from '@/types';
import { cn } from '@/lib/utils';
import { Building2, User, Calendar, Mail, Clock, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ApplicationCardProps {
  application: Application;
  isDragging?: boolean;
}

export function ApplicationCard({ application, isDragging }: ApplicationCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getNextAction = () => {
    if (application.status === 'researching') return 'Draft email';
    if (application.status === 'ready') return 'Send email';
    if (application.nextFollowUpAt) {
      const date = new Date(application.nextFollowUpAt);
      const isToday = date.toDateString() === new Date().toDateString();
      const isTomorrow = date.toDateString() === new Date(Date.now() + 86400000).toDateString();
      if (isToday) return 'Follow-up today';
      if (isTomorrow) return 'Follow-up tomorrow';
      return `Follow-up ${formatDate(application.nextFollowUpAt)}`;
    }
    return null;
  };

  const nextAction = getNextAction();
  const isUrgent = nextAction?.includes('today');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ scale: 1.02 }}
      className={cn(isDragging && 'rotate-3 scale-105')}
    >
      <Card className={cn(
        'cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md',
        isDragging && 'shadow-lg ring-2 ring-primary'
      )}>
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">{application.company.name}</h4>
                <p className="text-xs text-muted-foreground">{application.role}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Edit Email</DropdownMenuItem>
                <DropdownMenuItem>Add Notes</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Contact */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
            <User className="h-3 w-3" />
            <span>{application.contact.name}</span>
            <span className="text-muted-foreground/50">•</span>
            <span>{application.contact.role}</span>
          </div>

          {/* Timeline Info */}
          <div className="space-y-1.5 text-xs">
            {application.sentAt && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-3 w-3" />
                <span>Sent: {formatDate(application.sentAt)}</span>
              </div>
            )}
            {nextAction && (
              <div className={cn(
                'flex items-center gap-2',
                isUrgent ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'
              )}>
                <Clock className="h-3 w-3" />
                <span>{nextAction}</span>
                {isUrgent && <span>⏰</span>}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-3 pt-3 border-t">
            <Link href={`/applications/${application.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full text-xs">
                View
              </Button>
            </Link>
            <Link href={`/compose?applicationId=${application.id}`}>
              <Button variant="outline" size="sm" className="text-xs">
                <Mail className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
