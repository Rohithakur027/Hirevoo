'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import UploadContacts from '@/components/campaigns/ContactUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCampaign } from '@/context/CampaignContext';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function NewCampaignPage() {
  const router = useRouter();
  const { campaign, updateCampaignName } = useCampaign();

  // Get today's date in format: "Jan 13, 2026"
  const today = new Date();
  const defaultCampaignName = today.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const [campaignName, setCampaignName] = useState(campaign?.name || defaultCampaignName);

  const handleCampaignNameChange = (name: string) => {
    setCampaignName(name);
    updateCampaignName(name);
  };

  return (
    <div className="h-full w-full bg-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full"
      >
        {/* Upload Contacts Component */}
        <UploadContacts campaignName={campaignName} onCampaignNameChange={handleCampaignNameChange} />
      </motion.div>
    </div>
  );
}
