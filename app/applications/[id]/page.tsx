'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SpamHighlighter } from '@/components/compose/SpamHighlighter';
import { SpamScoreGauge } from '@/components/SpamScoreGauge';
import { QualityScoreGauge } from '@/components/QualityScoreGauge';
import { WarmthMeter } from '@/components/WarmthMeter';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockApplications } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  Building2,
  User,
  Mail,
  Calendar,
  Clock,
  Edit3,
  RefreshCw,
  Send,
  ExternalLink,
  CheckCircle2,
  Circle,
  Wand2,
  Settings,
} from 'lucide-react';

const statusColors = {
  researching: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  ready: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  sent: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  response: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  interview: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  offer: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function ApplicationDetailPage() {
  const params = useParams();
  const applicationId = params.id as string;
  
  const application = mockApplications.find(a => a.id === applicationId);
  const [notes, setNotes] = useState(application?.notes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  if (!application) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Application not found</p>
          <Link href="/applications">
            <Button className="mt-4">Back to Applications</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const email = application.emails[0];

  const timelineItems = [
    {
      type: 'initial',
      label: 'Initial Email',
      date: application.sentAt,
      status: application.sentAt ? 'completed' : email?.status === 'draft' ? 'current' : 'pending',
      email: email,
    },
    {
      type: 'followup1',
      label: 'Follow-up #1',
      date: application.nextFollowUpAt,
      status: application.followUpCount >= 1 ? 'completed' : 
              (application.sentAt && !application.responseAt) ? 'scheduled' : 'pending',
    },
    {
      type: 'followup2',
      label: 'Follow-up #2',
      date: null,
      status: application.followUpCount >= 2 ? 'completed' : 'pending',
    },
    {
      type: 'final',
      label: 'Final Email',
      date: null,
      status: 'pending',
    },
  ];

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Link href="/applications">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">{application.company.name}</h1>
                  <Badge className={cn('capitalize', statusColors[application.status])}>
                    {application.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{application.role}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Edit3 className="h-4 w-4" />
              Edit
            </Button>
            {application.status === 'ready' && (
              <Button className="gap-2 gradient-primary text-white">
                <Send className="h-4 w-4" />
                Send Now
              </Button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Timeline & Email */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold">{application.contact.name}</p>
                      <p className="text-sm text-muted-foreground">{application.contact.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{application.contact.email}</p>
                    {application.contact.linkedinUrl && (
                      <a
                        href={application.contact.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                      >
                        LinkedIn <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Email Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Email Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timelineItems.map((item, index) => (
                    <div key={item.type} className="flex gap-4">
                      {/* Timeline Line */}
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center',
                          item.status === 'completed' && 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
                          item.status === 'current' && 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
                          item.status === 'scheduled' && 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
                          item.status === 'pending' && 'bg-muted text-muted-foreground',
                        )}>
                          {item.status === 'completed' ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : item.status === 'scheduled' ? (
                            <Clock className="h-4 w-4" />
                          ) : (
                            <Circle className="h-4 w-4" />
                          )}
                        </div>
                        {index < timelineItems.length - 1 && (
                          <div className={cn(
                            'w-0.5 flex-1 min-h-[40px]',
                            item.status === 'completed' ? 'bg-emerald-200 dark:bg-emerald-800' : 'bg-muted'
                          )} />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{item.label}</p>
                          {item.date && (
                            <span className="text-sm text-muted-foreground">
                              {formatDate(item.date)}
                            </span>
                          )}
                        </div>
                        
                        {item.email && (
                          <div className="mt-3 p-4 rounded-lg bg-muted/50">
                            <p className="text-sm font-medium mb-2">
                              Subject: {item.email.subject}
                            </p>
                            <div className="text-sm text-muted-foreground">
                              <SpamHighlighter text={item.email.body} readOnly />
                            </div>
                          </div>
                        )}

                        {item.status === 'scheduled' && (
                          <div className="mt-2 flex gap-2">
                            <Button size="sm" variant="outline">Preview</Button>
                            <Button size="sm" variant="outline">Send Now</Button>
                            <Button size="sm" variant="outline">Skip</Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Scores & Notes */}
          <div className="space-y-4">
            {/* Email Scores */}
            {email && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Email Quality</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-center">
                    <SpamScoreGauge score={email.spamScore} size="sm" />
                  </div>
                  <div className="flex justify-center">
                    <QualityScoreGauge score={email.qualityScore} size="sm" />
                  </div>
                  <div className="flex justify-center">
                    <WarmthMeter score={email.warmthScore} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Company Intel */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Company Intel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Funding</p>
                  <p className="font-medium">{application.company.fundingStage} {application.company.fundingAmount && `- ${application.company.fundingAmount}`}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Team Size</p>
                  <p className="font-medium">{application.company.teamSize} people</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tech Stack</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {application.company.techStack.slice(0, 5).map(tech => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
                {application.company.recentNews?.[0] && (
                  <div>
                    <p className="text-sm text-muted-foreground">Recent News</p>
                    <p className="text-sm">{application.company.recentNews[0].title}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Notes</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingNotes(!isEditingNotes)}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isEditingNotes ? (
                  <div className="space-y-2">
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes about this application..."
                      className="min-h-[100px]"
                    />
                    <Button size="sm" onClick={() => setIsEditingNotes(false)}>
                      Save Notes
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {notes || 'No notes yet. Click edit to add notes.'}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-primary" />
                  Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href={`/compose?applicationId=${application.id}`}>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Edit3 className="h-4 w-4" />
                    Edit Email
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Regenerate Email
                </Button>
                <Link href="/settings">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Settings className="h-4 w-4" />
                    Follow-up Settings
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
