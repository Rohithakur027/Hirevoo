'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { Application, ApplicationStatus } from '@/types';
import { SortableApplicationCard } from './SortableApplicationCard';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  id: ApplicationStatus;
  title: string;
  applications: Application[];
  color: string;
  icon: string;
}

export function KanbanColumn({ id, title, applications, color, icon }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex flex-col min-w-[280px] max-w-[320px]">
      {/* Column Header */}
      <div className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-t-lg',
        color
      )}>
        <span>{icon}</span>
        <h3 className="font-semibold text-sm">{title}</h3>
        <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">
          {applications.length}
        </span>
      </div>

      {/* Column Content */}
      <motion.div
        ref={setNodeRef}
        className={cn(
          'flex-1 p-2 space-y-2 rounded-b-lg bg-muted/30 min-h-[400px] transition-colors',
          isOver && 'bg-primary/10 ring-2 ring-primary ring-dashed'
        )}
      >
        <SortableContext items={applications.map(a => a.id)} strategy={verticalListSortingStrategy}>
          {applications.map(application => (
            <SortableApplicationCard key={application.id} application={application} />
          ))}
        </SortableContext>

        {applications.length === 0 && (
          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
            Drop applications here
          </div>
        )}
      </motion.div>
    </div>
  );
}
