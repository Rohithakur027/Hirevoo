'use client';

import { useCallback, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  ContactsList,
  EmailEditor,
} from '@/components/campaigns';
import { CampaignContact } from '@/types';
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

  const handleGenerateEmail = useCallback((prompt: string, tone: string) => {
    if (!currentContactId) return;
    // Simulate AI generation (would call API in real app)
    const simulatedSubject = `${prompt.slice(0, 50)}${prompt.length > 50 ? '...' : ''}`;
    const simulatedBody = `Dear ${currentContact?.name.split(' ')[0] || 'Contact'},

${prompt}

Best regards,
[Your Name]`;

    updateContactEmail(currentContactId, simulatedSubject, simulatedBody);
  }, [currentContactId, currentContact?.name, updateContactEmail]);

  const handleCopyToEditor = useCallback((text: string) => {
    // This would handle copying text from AI to editor
    console.log('Copying to editor:', text);
  }, []);;


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
        {/* Compact Step Indicator */}
        <div className="flex items-center justify-between py-2 border-b border-border/50">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-primary">Step 2/3</span>
            <span className="text-xs text-muted-foreground">Compose Emails</span>
          </div>
          <button
            onClick={() => router.push('/campaigns/new')}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Contacts
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold">{campaign.name}</h1>
          <p className="text-muted-foreground">
            Write personalized emails for each contact ({completedCount}/{totalCount} done)
          </p>
        </div>

        {/* Responsive Layout - Mobile: Stack, Desktop: Side-by-side */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-3 lg:gap-4 min-h-0">
          {/* Left column: Contacts List (Full Height) */}
          <div className="lg:col-span-1 overflow-hidden">
            <ContactsList
              contacts={campaign.contacts}
              selectedContactId={currentContactId || undefined}
              onSelectContact={(contact: CampaignContact) => handleSelectContact(contact.id)}
            />
          </div>

          {/* Center/Right: Email Editor */}
          <div className="lg:col-span-3 overflow-hidden">
            <EmailEditor
              contact={currentContact || null}
              onSaveDraft={handleSaveDraft}
              onMarkDone={handleMarkDone}
              onGenerateEmail={handleGenerateEmail}
              onCopyToEditor={handleCopyToEditor}
              isGeneratingEmail={false}
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
