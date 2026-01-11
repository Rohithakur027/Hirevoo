'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StepIndicator, ContactUploader } from '@/components/campaigns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCampaign } from '@/context/CampaignContext';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { CampaignContact } from '@/types';

export default function NewCampaignPage() {
  const router = useRouter();
  const { setCampaign, campaign } = useCampaign();
  
  const [campaignName, setCampaignName] = useState(campaign?.name || 'My Campaign');
  const [contacts, setContacts] = useState<Omit<CampaignContact, 'id' | 'emailStatus'>[]>(
    campaign?.contacts?.map(c => ({ name: c.name, email: c.email, company: c.company, role: c.role })) || []
  );

  const handleContactsUploaded = (uploadedContacts: Omit<CampaignContact, 'id' | 'emailStatus'>[]) => {
    setContacts(uploadedContacts);
  };

  const handleNext = () => {
    if (contacts.length === 0) return;

    // Create or update campaign
    const newCampaign = {
      id: campaign?.id || `campaign-${Date.now()}`,
      name: campaignName,
      status: 'composing' as const,
      contacts: contacts.map((c, index) => ({
        ...c,
        id: `contact-${Date.now()}-${index}`,
        emailStatus: 'pending' as const,
      })),
      createdAt: campaign?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCampaign(newCampaign);
    router.push(`/campaigns/${newCampaign.id}/compose`);
  };

  const canProceed = contacts.length > 0 && campaignName.trim();

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto space-y-6"
      >
        {/* Step Indicator */}
        <StepIndicator currentStep={1} />

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create New Campaign</h1>
          <p className="text-muted-foreground mt-2">
            Upload your contact list to get started.
          </p>
        </div>

        {/* Campaign Name */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>Give your campaign a name to help identify it.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="campaignName">Campaign Name</Label>
              <Input
                id="campaignName"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="e.g., Q1 Outreach, Frontend Jobs, etc."
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Uploader */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Contacts</CardTitle>
            <CardDescription>
              Upload a CSV file with your contacts. Required column: email. Optional: name, company, role.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContactUploader
              onContactsUploaded={handleContactsUploaded}
              uploadedContacts={contacts}
            />
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => router.push('/campaigns')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Campaigns
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className="gap-2 gradient-primary text-white"
          >
            Next: Compose Emails
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
