'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KanbanBoard } from '@/components/applications/KanbanBoard';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { mockApplications } from '@/lib/mock-data';
import { ApplicationStatus } from '@/types';
import { Kanban, Plus, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState(mockApplications);
  const [filter, setFilter] = useState<string>('all');

  const handleApplicationMove = (applicationId: string, newStatus: ApplicationStatus) => {
    setApplications(apps =>
      apps.map(app =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      )
    );
  };

  const filteredApplications = filter === 'all'
    ? applications
    : applications.filter(app => app.status === filter);

  if (applications.length === 0) {
    return (
      <DashboardLayout>
        <EmptyState
          icon={Kanban}
          title="No applications yet"
          description="Start by composing your first email, then track follow-ups and replies here."
          action={{
            label: 'Compose Email',
            onClick: () => router.push('/compose'),
          }}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Applications</h1>
            <p className="text-muted-foreground mt-1">
              Track your outreach from draft to reply and interview.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="researching">Researching</SelectItem>
                <SelectItem value="ready">Ready to Send</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="response">Response</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
              </SelectContent>
            </Select>
            <Link href="/compose">
              <Button className="gap-2 gradient-primary text-white">
                <Plus className="h-4 w-4" />
                Compose Email
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-5 gap-4">
          {[
            { label: 'Researching', count: applications.filter(a => a.status === 'researching').length, color: 'bg-slate-500' },
            { label: 'Ready', count: applications.filter(a => a.status === 'ready').length, color: 'bg-blue-500' },
            { label: 'Sent', count: applications.filter(a => a.status === 'sent').length, color: 'bg-indigo-500' },
            { label: 'Response', count: applications.filter(a => a.status === 'response').length, color: 'bg-amber-500' },
            { label: 'Interview', count: applications.filter(a => a.status === 'interview').length, color: 'bg-emerald-500' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-card border"
            >
              <div className={`w-3 h-3 rounded-full ${stat.color}`} />
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="font-semibold">{stat.count}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Kanban Board */}
        <KanbanBoard
          applications={filteredApplications}
          onApplicationMove={handleApplicationMove}
        />
      </motion.div>
    </DashboardLayout>
  );
}
