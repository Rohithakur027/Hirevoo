'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/EmptyState';
import { useCampaign } from '@/context/CampaignContext';
import {
  Plus,
  Mail,
  Users,
  Send,
  Clock,
  CheckCircle2,
  Edit3,
  Trash2,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Campaign } from '@/types';

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300', icon: Edit3 },
  composing: { label: 'Composing', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: Edit3 },
  ready: { label: 'Ready to Send', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Clock },
  sending: { label: 'Sending', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400', icon: Send },
  sent: { label: 'Sent', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle2 },
};

export default function CampaignsPage() {
  const { campaign, resetCampaign } = useCampaign();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  // Load current campaign into list
  useEffect(() => {
    if (campaign) {
      setCampaigns([campaign]);
    }
  }, [campaign]);

  const getNextAction = (c: Campaign) => {
    if (c.status === 'draft' || c.contacts.length === 0) {
      return { label: 'Upload Contacts', href: '/campaigns/new' };
    }
    if (c.status === 'composing') {
      const done = c.contacts.filter(ct => ct.emailStatus === 'done').length;
      return { label: `Continue Writing (${done}/${c.contacts.length})`, href: `/campaigns/${c.id}/compose` };
    }
    if (c.status === 'ready') {
      return { label: 'Review & Send', href: `/campaigns/${c.id}/send` };
    }
    return null;
  };

  const handleDelete = (campaignId: string) => {
    if (campaign?.id === campaignId) {
      resetCampaign();
    }
    setCampaigns(prev => prev.filter(c => c.id !== campaignId));
  };

  return (
    <div className="h-full overflow-y-auto bg-muted/30 p-4 md:p-8 pt-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Campaigns</h1>
              <p className="text-muted-foreground mt-1">
                Create and manage your email campaigns.
              </p>
            </div>
            <Link href="/campaigns/new">
              <Button className="gap-2 gradient-primary text-white">
                <Plus className="h-4 w-4" />
                New Campaign
              </Button>
            </Link>
          </div>

          {/* Campaign List or Empty State */}
          {campaigns.length === 0 ? (
            <EmptyState
              icon={Mail}
              title="No campaigns yet"
              description="Create your first campaign to start sending personalized emails at scale."
              action={{
                label: 'Create Campaign',
                onClick: () => window.location.href = '/campaigns/new',
              }}
            />
          ) : (
            <div className="grid gap-4">
              {campaigns.map((c, index) => {
                const status = statusConfig[c.status];
                const StatusIcon = status.icon;
                const nextAction = getNextAction(c);
                const completedEmails = c.contacts.filter(ct => ct.emailStatus === 'done').length;

                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          {/* Campaign Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold">{c.name}</h3>
                              <Badge className={cn('gap-1', status.color)}>
                                <StatusIcon className="w-3 h-3" />
                                {status.label}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <Users className="w-4 h-4" />
                                <span>{c.contacts.length} contacts</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Mail className="w-4 h-4" />
                                <span>{completedEmails}/{c.contacts.length} emails written</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                <span>Updated {new Date(c.updatedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDelete(c.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>

                            {nextAction && (
                              <Link href={nextAction.href}>
                                <Button className="gap-2">
                                  {nextAction.label}
                                  <ArrowRight className="w-4 h-4" />
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {c.contacts.length > 0 && (
                          <div className="mt-4">
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-emerald-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${(completedEmails / c.contacts.length) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
