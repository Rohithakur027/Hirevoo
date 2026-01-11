'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { User, Building2, Save, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CampaignContact } from '@/types';
import { cn } from '@/lib/utils';

interface EmailEditorProps {
  contact: CampaignContact | null;
  onSaveDraft: (contactId: string, subject: string, body: string) => void;
  onMarkDone: (contactId: string, subject: string, body: string) => void;
}

export function EmailEditor({ contact, onSaveDraft, onMarkDone }: EmailEditorProps) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load email content when contact changes
  useEffect(() => {
    if (contact) {
      setSubject(contact.emailSubject || '');
      setBody(contact.emailBody || '');
    } else {
      setSubject('');
      setBody('');
    }
  }, [contact?.id]); // Only depend on contact id

  // Auto-save debounced
  useEffect(() => {
    if (!contact || !subject && !body) return;
    
    const timer = setTimeout(() => {
      onSaveDraft(contact.id, subject, body);
    }, 1000);

    return () => clearTimeout(timer);
  }, [subject, body, contact?.id]);

  const handleSaveDraft = useCallback(() => {
    if (!contact) return;
    setIsSaving(true);
    onSaveDraft(contact.id, subject, body);
    setTimeout(() => setIsSaving(false), 500);
  }, [contact, subject, body, onSaveDraft]);

  const handleMarkDone = useCallback(() => {
    if (!contact || !subject || !body) return;
    onMarkDone(contact.id, subject, body);
  }, [contact, subject, body, onMarkDone]);

  if (!contact) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center">
          <p className="text-muted-foreground">Select a contact to compose an email</p>
        </CardContent>
      </Card>
    );
  }

  const isDone = contact.emailStatus === 'done';
  const canMarkDone = subject.trim() && body.trim();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Email Editor</CardTitle>
          {isDone && (
            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              <CheckCircle className="w-3 h-3 mr-1" />
              Done
            </Badge>
          )}
        </div>
        
        {/* Recipient Info */}
        <div className="flex items-center gap-4 mt-3 p-3 rounded-lg bg-muted/50">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{contact.name}</p>
            <p className="text-sm text-muted-foreground truncate">{contact.email}</p>
          </div>
          {contact.company && (
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="w-4 h-4" />
              <span>{contact.company}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col pt-4 space-y-4 overflow-hidden">
        {/* Subject */}
        <div className="space-y-2">
          <Label htmlFor="subject">Subject Line</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter email subject..."
            className={cn(isDone && 'bg-muted')}
          />
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col space-y-2 min-h-0">
          <Label htmlFor="body">Email Body</Label>
          <Textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your email here..."
            className={cn('flex-1 min-h-[200px] resize-none', isDone && 'bg-muted')}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2 border-t">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button
            onClick={handleMarkDone}
            disabled={!canMarkDone}
            className={cn(
              'gap-2 flex-1',
              isDone ? 'bg-emerald-600 hover:bg-emerald-700' : 'gradient-primary'
            )}
          >
            {isDone ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Marked as Done
              </>
            ) : (
              <>
                Mark Done & Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
