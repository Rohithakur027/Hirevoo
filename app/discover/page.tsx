'use client';

import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, PenSquare, Kanban, Settings } from 'lucide-react';

export default function DiscoverPage() {
  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              Company discovery is coming in Phase 2
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Phase 1 focuses on sending outreach to your existing contacts and managing follow-ups.
              Recruiter search / company discovery will arrive in Phase 2.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button asChild className="gradient-primary text-white">
                <Link href="/compose">
                  <PenSquare className="h-4 w-4 mr-2" />
                  Compose Email
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/applications">
                  <Kanban className="h-4 w-4 mr-2" />
                  Applications
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Follow-up Schedule
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
