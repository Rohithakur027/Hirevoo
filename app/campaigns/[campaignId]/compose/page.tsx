'use client';

import { useCallback, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  StepIndicator,
  ContactList,
  EmailEditor,
  AIAssistant,
} from '@/components/campaigns';
import { Button } from '@/components/ui/button';
import { useCampaign } from '@/context/CampaignContext';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function ComposePage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.campaignId as string;
  
  const {
    campaign,
    currentContactId,
    setCurrentContactId,
    getContactById,
    updateContactEmail,
    markContactDone,
    completedCount,
    totalCount,
  } = useCampaign();

  // Redirect if no campaign
  useEffect(() => {
    if (!campaign || campaign.contacts.length === 0) {
      router.push('/campaigns/new');
    }
  }, [campaign, router]);

  const currentContact = currentContactId ? getContactById(currentContactId) : null;

  const handleSelectContact = useCallback((contactId: string) => {
    setCurrentContactId(contactId);
  }, [setCurrentContactId]);

  const handleSaveDraft = useCallback((contactId: string, subject: string, body: string) => {
    updateContactEmail(contactId, subject, body);
  }, [updateContactEmail]);

  const handleMarkDone = useCallback((contactId: string, subject: string, body: string) => {
    updateContactEmail(contactId, subject, body);
    markContactDone(contactId);
  }, [updateContactEmail, markContactDone]);

  const handleCopyFromAI = useCallback((subject: string, body: string) => {
    if (!currentContactId) return;
    updateContactEmail(currentContactId, subject, body);
  }, [currentContactId, updateContactEmail]);

  const handleBack = () => {
    router.push('/campaigns/new');
  };

  const handleNext = () => {
    if (campaign) {
      router.push(`/campaigns/${campaign.id}/send`);
    }
  };

  const canProceed = completedCount > 0;
  const allDone = completedCount === totalCount;

  if (!campaign) {
    return null;
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-[calc(100vh-8rem)] flex flex-col"
      >
        {/* Step Indicator */}
        <StepIndicator
          currentStep={2}
          completedSteps={[1]}
          onStepClick={(step) => {
            if (step === 1) router.push('/campaigns/new');
          }}
        />

        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold">{campaign.name}</h1>
          <p className="text-muted-foreground">
            Write personalized emails for each contact ({completedCount}/{totalCount} done)
          </p>
        </div>

        {/* 3-Panel Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
          {/* Left Panel - Contact List */}
          <div className="lg:col-span-3 min-h-[300px] lg:min-h-0">
            <ContactList
              contacts={campaign.contacts}
              currentContactId={currentContactId}
              onSelectContact={handleSelectContact}
            />
          </div>

          {/* Middle Panel - Email Editor */}
          <div className="lg:col-span-5 min-h-[400px] lg:min-h-0">
            <EmailEditor
              contact={currentContact || null}
              onSaveDraft={handleSaveDraft}
              onMarkDone={handleMarkDone}
            />
          </div>

          {/* Right Panel - AI Assistant */}
          <div className="lg:col-span-4 min-h-[400px] lg:min-h-0">
            <AIAssistant
              contact={currentContact || null}
              onCopyToEditor={handleCopyFromAI}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back: Upload Contacts
          </Button>

          <div className="flex items-center gap-3">
            {!allDone && (
              <p className="text-sm text-muted-foreground hidden sm:block">
                {totalCount - completedCount} emails remaining
              </p>
            )}
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="gap-2 gradient-primary text-white"
            >
              {allDone ? 'Review & Send' : 'Continue to Send'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
