'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Application, ApplicationStatus } from '@/types';
import { KanbanColumn } from './KanbanColumn';
import { ApplicationCard } from './ApplicationCard';

interface KanbanBoardProps {
  applications: Application[];
  onApplicationMove?: (applicationId: string, newStatus: ApplicationStatus) => void;
}

const columns: { id: ApplicationStatus; title: string; color: string; icon: string }[] = [
  { id: 'researching', title: 'Researching', color: 'bg-slate-200 dark:bg-slate-800', icon: '🔍' },
  { id: 'ready', title: 'Ready to Send', color: 'bg-blue-200 dark:bg-blue-900/50', icon: '📝' },
  { id: 'sent', title: 'Sent', color: 'bg-indigo-200 dark:bg-indigo-900/50', icon: '📤' },
  { id: 'response', title: 'Response', color: 'bg-amber-200 dark:bg-amber-900/50', icon: '💬' },
  { id: 'interview', title: 'Interview', color: 'bg-emerald-200 dark:bg-emerald-900/50', icon: '🎯' },
];

export function KanbanBoard({ applications: initialApplications, onApplicationMove }: KanbanBoardProps) {
  const [applications, setApplications] = useState(initialApplications);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if dropped on a column
    const isColumn = columns.some(col => col.id === overId);
    
    if (isColumn) {
      // Move to new column
      const newStatus = overId as ApplicationStatus;
      setApplications(apps => 
        apps.map(app => 
          app.id === activeId ? { ...app, status: newStatus } : app
        )
      );
      onApplicationMove?.(activeId, newStatus);
    }
  };

  const getApplicationsByStatus = (status: ApplicationStatus) => {
    return applications.filter(app => app.status === status);
  };

  const activeApplication = applications.find(app => app.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map(column => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            applications={getApplicationsByStatus(column.id)}
            color={column.color}
            icon={column.icon}
          />
        ))}
      </div>

      <DragOverlay>
        {activeApplication && (
          <div className="w-[280px]">
            <ApplicationCard application={activeApplication} isDragging />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
