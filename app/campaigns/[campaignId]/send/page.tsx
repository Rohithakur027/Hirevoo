'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StepIndicator } from '@/components/campaigns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useCampaign } from '@/context/CampaignContext';
import { SuccessAnimation } from '@/components/SuccessAnimation';
import {
  ArrowLeft,
  Send,
  Mail,
  Users,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  PartyPopper,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SendPage() {
  const router = useRouter();
  const params = useParams();
  
  const { campaign, setCampaign, completedCount, totalCount } = useCampaign();
  
  const [expandedEmails, setExpandedEmails] = useState<Set<string>>(new Set());
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Redirect if no campaign
  useEffect(() => {
    if (!campaign) {
      router.push('/campaigns/new');
    }
  }, [campaign, router]);

  if (!campaign) {
    return null;
  }

  const doneContacts = campaign.contacts.filter(c => c.emailStatus === 'done');
  const pendingContacts = campaign.contacts.filter(c => c.emailStatus !== 'done');
  const allDone = completedCount === totalCount;

  const toggleEmail = (contactId: string) => {
    setExpandedEmails(prev => {
      const next = new Set(prev);
      if (next.has(contactId)) {
        next.delete(contactId);
      } else {
        next.add(contactId);
      }
      return next;
    });
  };

  const handleSend = async () => {
    setIsSending(true);
    
    // Simulate sending (in real app, this would call an API)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update campaign status
    setCampaign({
      ...campaign,
      status: 'sent',
      sentAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    setIsSending(false);
    setIsSent(true);
  };

  const handleBack = () => {
    router.push(`/campaigns/${campaign.id}/compose`);
  };

  const handleFinish = () => {
    router.push('/campaigns');
  };

  // Success state
  if (isSent) {
    return (
      <DashboardLayout>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center min-h-[60vh] text-center"
        >
          <SuccessAnimation show={true} variant="campaign-created" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <div className="flex items-center justify-center gap-2 text-4xl mb-4">
              <PartyPopper className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Campaign Sent!</h1>
            <p className="text-muted-foreground mb-8">
              {doneContacts.length} emails have been sent successfully.
            </p>
            
            <Button onClick={handleFinish} className="gap-2 gradient-primary text-white">
              Back to Campaigns
            </Button>
          </motion.div>
        </motion.div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto space-y-6"
      >
        {/* Step Indicator */}
        <StepIndicator
          currentStep={3}
          completedSteps={allDone ? [1, 2] : [1]}
          onStepClick={(step) => {
            if (step === 1) router.push('/campaigns/new');
            if (step === 2) router.push(`/campaigns/${campaign.id}/compose`);
          }}
        />

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Review & Send</h1>
          <p className="text-muted-foreground mt-2">
            Review your emails before sending them.
          </p>
        </div>

        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Campaign Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Users className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Contacts</p>
                  <p className="text-xl font-bold">{totalCount}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="text-sm text-muted-foreground">Ready to Send</p>
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{completedCount}</p>
                </div>
              </div>
            </div>

            {/* Warning if not all done */}
            {!allDone && (
              <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-amber-800 dark:text-amber-300">
                      {pendingContacts.length} email{pendingContacts.length > 1 ? 's' : ''} not completed
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                      These contacts will be skipped. Go back to compose to complete them.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Email Preview List */}
        <Card>
          <CardHeader>
            <CardTitle>Email Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {doneContacts.map((contact) => (
              <Collapsible
                key={contact.id}
                open={expandedEmails.has(contact.id)}
                onOpenChange={() => toggleEmail(contact.id)}
              >
                <CollapsibleTrigger asChild>
                  <button className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3 text-left">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <div>
                        <p className="font-medium text-sm">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">{contact.email}</p>
                      </div>
                    </div>
                    {expandedEmails.has(contact.id) ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 mt-1 rounded-lg bg-card border">
                    <p className="text-sm font-medium mb-2">
                      Subject: {contact.emailSubject}
                    </p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {contact.emailBody}
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}

            {/* Skipped contacts */}
            {pendingContacts.length > 0 && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  Skipped ({pendingContacts.length})
                </p>
                {pendingContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 opacity-60"
                  >
                    <AlertCircle className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">{contact.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={isSending}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back: Compose Emails
          </Button>

          <Button
            onClick={handleSend}
            disabled={doneContacts.length === 0 || isSending}
            className="gap-2 gradient-primary text-white min-w-[160px]"
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send {doneContacts.length} Emails
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
