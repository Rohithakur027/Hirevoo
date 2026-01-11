'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Copy, Check, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CampaignContact } from '@/types';
import { cn } from '@/lib/utils';

interface AIAssistantProps {
  contact: CampaignContact | null;
  onCopyToEditor: (subject: string, body: string) => void;
}

type Tone = 'professional' | 'casual' | 'enthusiastic';

export function AIAssistant({ contact, onCopyToEditor }: AIAssistantProps) {
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState<Tone>('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState<{ subject: string; body: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const generateEmail = async () => {
    if (!contact || !prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation (in real app, this would call an API)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate based on prompt and contact info
    const greeting = tone === 'casual' ? 'Hey' : tone === 'enthusiastic' ? 'Hi' : 'Dear';
    const signOff = tone === 'casual' ? 'Cheers' : tone === 'enthusiastic' ? 'Best' : 'Kind regards';
    
    const firstName = contact.name.split(' ')[0];
    const companyMention = contact.company ? ` at ${contact.company}` : '';
    const roleMention = contact.role ? `I noticed you're a ${contact.role}${companyMention}. ` : '';
    
    // Simple template-based generation (would be AI in production)
    const generatedSubject = `${prompt.slice(0, 50)}${prompt.length > 50 ? '...' : ''}`;
    const generatedBody = `${greeting} ${firstName},

${roleMention}${prompt}

I'd love to connect and discuss this further. Would you be open to a quick chat?

${signOff},
[Your Name]`;

    setGeneratedEmail({
      subject: generatedSubject,
      body: generatedBody,
    });
    
    setIsGenerating(false);
  };

  const handleCopy = () => {
    if (!generatedEmail) return;
    onCopyToEditor(generatedEmail.subject, generatedEmail.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickPrompts = [
    'Introduce myself and my skills',
    'Follow up on our previous conversation',
    'Request a meeting to discuss opportunities',
    'Ask about open positions',
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Assistant
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col pt-4 space-y-4 overflow-hidden">
        {/* Tone Selector */}
        <div className="space-y-2">
          <Label>Tone</Label>
          <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Prompt Input */}
        <div className="space-y-2">
          <Label>What do you want to say?</Label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Write an email introducing myself as a software developer interested in frontend roles..."
            className="min-h-[80px] resize-none"
          />
        </div>

        {/* Quick Prompts */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Quick prompts</Label>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((qp) => (
              <button
                key={qp}
                onClick={() => setPrompt(qp)}
                className="text-xs px-2 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
              >
                {qp}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={generateEmail}
          disabled={!contact || !prompt.trim() || isGenerating}
          className="gap-2 gradient-primary"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              Generate with AI
            </>
          )}
        </Button>

        {/* Generated Email */}
        {generatedEmail && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col min-h-0 space-y-2"
          >
            <div className="flex items-center justify-between">
              <Label>Generated Email</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className={cn(
                  'gap-2 transition-colors',
                  copied && 'bg-emerald-50 text-emerald-600 border-emerald-200'
                )}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy to Editor
                  </>
                )}
              </Button>
            </div>
            
            <div className="flex-1 min-h-0 p-3 rounded-lg bg-muted/50 border overflow-auto">
              <p className="text-sm font-medium mb-2">
                Subject: {generatedEmail.subject}
              </p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {generatedEmail.body}
              </p>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!generatedEmail && !isGenerating && (
          <div className="flex-1 flex items-center justify-center text-center p-4">
            <div className="text-muted-foreground">
              <Wand2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                Write a prompt and click Generate to create an AI-powered email
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
