'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ComposeWindow } from '@/components/compose/ComposeWindow';
import { SpamHighlighter } from '@/components/compose/SpamHighlighter';
import { SpamScoreGauge } from '@/components/SpamScoreGauge';
import { QualityScoreGauge } from '@/components/QualityScoreGauge';
import { WarmthMeter } from '@/components/WarmthMeter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { mockCompanies, mockUserProfile, spamWords } from '@/lib/mock-data';
import {
  Wand2,
  Building2,
  User,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Sparkles,
  RefreshCw,
  X,
} from 'lucide-react';

const defaultEmail = `Hi [Name],

I saw [Company] just raised your Series A - congratulations! The work you're doing in [industry] is impressive.

I'm a [role] who recently built [project description]. Your tech stack matches exactly what I've been working with.

I noticed you're looking for [position]. I'd love to chat about how my experience could contribute to [Company]'s mission.

Would you be open to a 15-minute call this week?

Best,
Alex`;

export default function ComposePage() {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedContact, setSelectedContact] = useState('');
  const [role, setRole] = useState('Frontend Developer');
  const [personalTouch, setPersonalTouch] = useState('');
  const [subject, setSubject] = useState('Quick question about your engineering team');
  const [body, setBody] = useState(defaultEmail);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSpamIssues, setShowSpamIssues] = useState(false);
  const [showScores, setShowScores] = useState(true);
  const [showAIPanel, setShowAIPanel] = useState(false);

  const company = mockCompanies.find(c => c.id === selectedCompany);
  const contacts = company?.contacts || [];
  const contact = contacts.find(c => c.id === selectedContact);

  // Calculate spam score based on spam words found
  const spamIssues = useMemo(() => {
    const issues: { word: string; reason: string; suggestion: string; severity: string }[] = [];
    const lowerBody = body.toLowerCase();
    
    Object.entries(spamWords).forEach(([word, data]) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      if (regex.test(lowerBody)) {
        issues.push({ word, ...data });
      }
    });
    
    return issues;
  }, [body]);

  const spamScore = Math.min(100, spamIssues.length * 15 + 5);
  const qualityScore = Math.max(0, 85 - spamIssues.length * 10);
  const warmthScore = personalTouch.length > 50 ? 80 : personalTouch.length > 20 ? 60 : 40;

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (company) {
      const newBody = `Hi ${contact?.name.split(' ')[0] || 'there'},

${company.recentNews?.[0] ? `Congrats on "${company.recentNews[0].title.toLowerCase()}"! ` : ''}I've been following ${company.name}'s growth and the ${company.fundingStage} is impressive.

I'm a ${role} who recently built an e-commerce dashboard that reduced page load times by 40%. Your tech stack (${company.techStack.slice(0, 3).join(', ')}) matches exactly what I've been working with.

${personalTouch ? `${personalTouch}\n\n` : ''}I noticed you're looking for a ${role}. I'd love to chat about how my experience building performant, user-focused applications could contribute to ${company.name}'s mission.

Would you be open to a 15-minute call this week?

Best,
${mockUserProfile.name}`;
      
      setBody(newBody);
      setSubject(`${role} - Excited about ${company.name}'s ${company.fundingStage}`);
    }
    setIsGenerating(false);
  };

  const recipientDisplay = contact 
    ? `${contact.name} <${contact.email}>` 
    : company 
      ? `${company.name} Team`
      : '';

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[calc(100vh-6rem)]"
      >
        {/* Minimal Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">Compose</h1>
            {spamIssues.length > 0 && (
              <button
                onClick={() => setShowSpamIssues(!showSpamIssues)}
                className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 hover:underline"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                {spamIssues.length} issue{spamIssues.length > 1 ? 's' : ''}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={() => setShowScores(!showScores)}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Scores
              {showScores ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={() => setShowAIPanel(!showAIPanel)}
            >
              <Wand2 className="h-3.5 w-3.5" />
              AI
            </Button>
          </div>
        </div>

        <div className="flex gap-4">
          {/* Main Content - Gmail-style compose */}
          <div className="flex-1 flex flex-col">
            {/* Quick Context Selector */}
            <div className="flex items-center gap-3 mb-3">
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger className="w-40 h-8 text-xs border-border/50">
                  <Building2 className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  <SelectValue placeholder="Company" />
                </SelectTrigger>
                <SelectContent>
                  {mockCompanies.map(c => (
                    <SelectItem key={c.id} value={c.id} className="text-xs">
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {company && (
                <Select value={selectedContact} onValueChange={setSelectedContact}>
                  <SelectTrigger className="w-44 h-8 text-xs border-border/50">
                    <User className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                    <SelectValue placeholder="Contact" />
                  </SelectTrigger>
                  <SelectContent>
                    {contacts.map(c => (
                      <SelectItem key={c.id} value={c.id} className="text-xs">
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {company && (
                <div className="flex items-center gap-1.5 ml-auto">
                  {company.techStack.slice(0, 3).map(tech => (
                    <Badge key={tech} variant="secondary" className="text-[10px] h-5 px-1.5">
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Gmail-style Compose Window */}
            <ComposeWindow
              defaultTo={recipientDisplay}
              defaultSubject={subject}
              defaultBody={body}
              onSend={(data) => console.log('Send:', data)}
              onClose={() => console.log('Close')}
              onMinimize={() => console.log('Minimize')}
              showAIButton={true}
              onAIAssist={handleGenerate}
              isGenerating={isGenerating}
            >
              {/* Custom body with spam highlighting */}
              <div className="h-full min-h-[280px]">
                <SpamHighlighter 
                  text={body} 
                  onChange={setBody}
                />
              </div>
            </ComposeWindow>

            {/* Spam Issues - Collapsible below composer */}
            <AnimatePresence>
              {showSpamIssues && spamIssues.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 overflow-hidden"
                >
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                        Spam Issues
                      </span>
                      <button 
                        onClick={() => setShowSpamIssues(false)}
                        className="text-amber-500 hover:text-amber-600"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      {spamIssues.map((issue, index) => (
                        <div key={index} className="text-xs flex items-start gap-2">
                          <span className="font-medium text-amber-800 dark:text-amber-200">"{issue.word}"</span>
                          <span className="text-muted-foreground">→</span>
                          <span className="text-primary">{issue.suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Panel - Collapsible Scores & AI */}
          <AnimatePresence>
            {(showScores || showAIPanel) && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 240 }}
                exit={{ opacity: 0, width: 0 }}
                className="shrink-0 overflow-hidden"
              >
                <div className="w-60 space-y-3">
                  {/* Scores Panel */}
                  {showScores && (
                    <div className="bg-white dark:bg-gray-900 rounded-lg border border-border/50 p-3 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-muted-foreground">Quality Scores</span>
                        <button onClick={() => setShowScores(false)}>
                          <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                        </button>
                      </div>
                      <div className="flex flex-col items-center gap-4">
                        <div className="scale-75 origin-center -my-2">
                          <SpamScoreGauge score={spamScore} />
                        </div>
                        <div className="scale-75 origin-center -my-2">
                          <QualityScoreGauge score={qualityScore} />
                        </div>
                        <div className="scale-75 origin-center -my-2">
                          <WarmthMeter score={warmthScore} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* AI Panel */}
                  {showAIPanel && (
                    <div className="bg-white dark:bg-gray-900 rounded-lg border border-border/50 p-3 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium flex items-center gap-1.5">
                          <Wand2 className="h-3.5 w-3.5 text-primary" />
                          AI Assist
                        </span>
                        <button onClick={() => setShowAIPanel(false)}>
                          <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                        </button>
                      </div>
                      <div className="space-y-1.5">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-start h-8 text-xs gap-2"
                          onClick={handleGenerate}
                          disabled={isGenerating}
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          Generate Email
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full justify-start h-8 text-xs gap-2">
                          <RefreshCw className="h-3.5 w-3.5" />
                          Improve Opening
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full justify-start h-8 text-xs gap-2">
                          <Building2 className="h-3.5 w-3.5" />
                          Add Company Ref
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full justify-start h-8 text-xs gap-2">
                          <User className="h-3.5 w-3.5" />
                          Make Personal
                        </Button>
                      </div>

                      {/* Personal Touch Input */}
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <label className="text-[10px] text-muted-foreground uppercase tracking-wide">
                          Personal Touch
                        </label>
                        <textarea
                          value={personalTouch}
                          onChange={(e) => setPersonalTouch(e.target.value)}
                          placeholder="Your unique connection..."
                          className="w-full mt-1.5 text-xs bg-muted/30 border border-border/50 rounded p-2 min-h-[60px] resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>

                      {/* Role Input */}
                      <div className="mt-2">
                        <label className="text-[10px] text-muted-foreground uppercase tracking-wide">
                          Role
                        </label>
                        <input
                          type="text"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="w-full mt-1.5 text-xs bg-muted/30 border border-border/50 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
