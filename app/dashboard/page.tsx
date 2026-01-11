'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCampaign } from '@/context/CampaignContext';
import {
  Send,
  TrendingUp,
  Users,
  Mail,
  Plus,
  ArrowRight,
  Wand2,
  CheckCircle2,
  Clock,
  Edit3,
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { campaign, completedCount, totalCount } = useCampaign();

  const hasActiveCampaign = campaign && campaign.contacts.length > 0;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-5 sm:space-y-6"
      >
        {/* Welcome Header */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <motion.h1
              className="text-2xl sm:text-3xl font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              Welcome to Hirevoo
              <span className="hidden sm:inline"> 👋</span>
            </motion.h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Create personalized email campaigns at scale with AI assistance.
            </p>
          </div>
          <Link href="/campaigns/new">
            <Button className="gap-2 gradient-primary text-white group h-9 sm:h-10 px-3 sm:px-4">
              <Plus className="h-4 w-4" />
              <span className="text-sm">New Campaign</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {/* Active Campaign Banner */}
        {hasActiveCampaign && (
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{campaign.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {campaign.status === 'composing' ? 'In Progress' : campaign.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {completedCount}/{totalCount} emails written • {progress}% complete
                      </p>
                      {/* Progress bar */}
                      <div className="mt-2 w-48 h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                  <Link href={`/campaigns/${campaign.id}/compose`}>
                    <Button className="gap-2">
                      <Edit3 className="h-4 w-4" />
                      Continue Writing
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Campaigns"
            value={hasActiveCampaign ? 1 : 0}
            icon={Mail}
            description="created"
            index={0}
          />
          <StatsCard
            title="Contacts"
            value={totalCount}
            icon={Users}
            description="in campaigns"
            index={1}
          />
          <StatsCard
            title="Emails Written"
            value={completedCount}
            icon={CheckCircle2}
            description="ready to send"
            index={2}
          />
          <StatsCard
            title="Completion"
            value={`${progress}%`}
            icon={TrendingUp}
            description="of current campaign"
            index={3}
          />
        </div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { href: '/campaigns/new', icon: Plus, label: 'New Campaign', primary: true },
                  { href: '/campaigns', icon: Mail, label: 'View Campaigns' },
                  { href: '/profile', icon: Users, label: 'Edit Profile' },
                  { href: '/settings', icon: Clock, label: 'Settings' },
                ].map((action, index) => (
                  <Link key={action.href + action.label} href={action.href}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant={action.primary ? 'default' : 'outline'}
                        className={`w-full h-auto py-3 sm:py-4 flex-col gap-2 ${action.primary ? 'gradient-primary text-white' : ''}`}
                      >
                        <action.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-[11px] sm:text-xs text-center leading-tight">
                          {action.label}
                        </span>
                      </Button>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* How It Works */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  {
                    step: 1,
                    title: 'Upload Contacts',
                    description: 'Upload a CSV file with your contact list (name, email, company)',
                    icon: Users,
                  },
                  {
                    step: 2,
                    title: 'Compose Emails',
                    description: 'Write personalized emails with AI assistance for each contact',
                    icon: Edit3,
                  },
                  {
                    step: 3,
                    title: 'Send Campaign',
                    description: 'Review and send all your emails at once',
                    icon: Send,
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-xs text-muted-foreground mb-1">Step {item.step}</div>
                    <h4 className="font-medium mb-1">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pro Tip */}
        <motion.div
          variants={itemVariants}
          className="text-center text-sm text-muted-foreground"
        >
          <span className="inline-flex items-center gap-1">
            <Wand2 className="h-4 w-4 text-primary" />
            <strong>Pro tip:</strong> Use the AI assistant to generate personalized emails 3x faster!
          </span>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
