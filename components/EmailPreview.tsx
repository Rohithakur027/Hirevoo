'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeneratedEmail, Lead } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { SpamScoreGauge } from './SpamScoreGauge';
import { QualityScoreGauge } from './QualityScoreGauge';
import { WarmthMeter } from './WarmthMeter';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { RefreshCw, Send, Edit3, Check, X, AlertTriangle, ChevronDown, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

// Spammy words list with explanations
const SPAM_WORDS: Record<string, string> = {
  'free': 'Overused in spam emails, triggers filters',
  'guarantee': 'Strong promises raise red flags',
  'limited time': 'Creates artificial urgency, common in spam',
  'act now': 'Pressure tactic flagged by filters',
  'exclusive': 'Often used to create false scarcity',
  'winner': 'Associated with lottery/prize scams',
  'congratulations': 'Common in phishing emails',
  'urgent': 'Pressure language triggers spam filters',
  'click here': 'Vague CTAs are spam indicators',
  'buy now': 'Direct sales language is risky',
  'limited offer': 'Scarcity tactic flagged as spam',
  'risk free': 'Unrealistic promises trigger filters',
  'no obligation': 'Often used to hide catches',
  'million dollars': 'Associated with scam emails',
  'credit card': 'Financial terms raise red flags',
  'double your': 'Exaggerated promises flagged',
  'earn money': 'Common in get-rich-quick spam',
  'work from home': 'Associated with scam offers',
  'as seen on': 'Fake endorsement indicator',
  'order now': 'Aggressive sales language',
};

interface SpamIssue {
  word: string;
  explanation: string;
  suggestion: string;
  severity: 'high' | 'medium' | 'low';
}

interface EmailPreviewProps {
  email: GeneratedEmail;
  lead?: Lead;
  onRegenerate?: () => void;
  onSend?: () => void;
  onEdit?: (subject: string, body: string) => void;
}

export function EmailPreview({
  email,
  lead,
  onRegenerate,
  onSend,
  onEdit,
}: EmailPreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSubject, setEditedSubject] = useState(email.subject);
  const [editedBody, setEditedBody] = useState(email.body);
  const [spamPanelOpen, setSpamPanelOpen] = useState(false);
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);

  // Find spam issues in text
  const findSpamIssues = (text: string): SpamIssue[] => {
    const issues: SpamIssue[] = [];
    const lowerText = text.toLowerCase();

    Object.entries(SPAM_WORDS).forEach(([word, explanation]) => {
      if (lowerText.includes(word.toLowerCase())) {
        issues.push({
          word,
          explanation,
          suggestion: getSuggestion(word),
          severity: getSeverity(word),
        });
      }
    });

    return issues;
  };

  const getSuggestion = (word: string): string => {
    const suggestions: Record<string, string> = {
      'free': 'Try "complimentary" or "no cost to you"',
      'guarantee': 'Use "we\'re confident" or "backed by"',
      'limited time': 'Be specific about deadlines instead',
      'act now': 'Use "when you\'re ready" for softer CTA',
      'exclusive': 'Try "specially selected" or be specific',
      'click here': 'Use descriptive link text like "view the demo"',
      'buy now': 'Use "learn more" or "explore options"',
      'urgent': 'Remove or provide genuine context',
    };
    return suggestions[word.toLowerCase()] || 'Consider removing or rephrasing';
  };

  const getSeverity = (word: string): 'high' | 'medium' | 'low' => {
    const highRisk = ['free', 'guarantee', 'winner', 'million dollars', 'credit card'];
    const mediumRisk = ['limited time', 'act now', 'exclusive', 'urgent', 'click here'];
    
    if (highRisk.some(w => word.toLowerCase().includes(w))) return 'high';
    if (mediumRisk.some(w => word.toLowerCase().includes(w))) return 'medium';
    return 'low';
  };

  // Highlight spam words in text
  const highlightSpamWords = (text: string): React.ReactNode => {
    const issues = findSpamIssues(text);
    if (issues.length === 0) return text;

    let result = text;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    // Sort by position in text
    const matches: { word: string; index: number; issue: SpamIssue }[] = [];
    issues.forEach(issue => {
      const regex = new RegExp(issue.word, 'gi');
      let match;
      while ((match = regex.exec(text)) !== null) {
        matches.push({ word: match[0], index: match.index, issue });
      }
    });

    matches.sort((a, b) => a.index - b.index);

    matches.forEach((match, i) => {
      // Add text before this match
      if (match.index > lastIndex) {
        elements.push(text.slice(lastIndex, match.index));
      }

      // Add highlighted word
      elements.push(
        <TooltipProvider key={i}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <span
                className={cn(
                  'relative cursor-help transition-all',
                  match.issue.severity === 'high' && 'bg-red-200 dark:bg-red-900/50 underline decoration-red-500 decoration-wavy',
                  match.issue.severity === 'medium' && 'bg-amber-200 dark:bg-amber-900/50 underline decoration-amber-500 decoration-wavy',
                  match.issue.severity === 'low' && 'bg-yellow-100 dark:bg-yellow-900/30 underline decoration-yellow-500 decoration-dotted',
                  hoveredWord === match.word && 'ring-2 ring-red-500 ring-offset-1'
                )}
                onMouseEnter={() => setHoveredWord(match.word)}
                onMouseLeave={() => setHoveredWord(null)}
              >
                {match.word}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={cn(
                    'h-4 w-4',
                    match.issue.severity === 'high' && 'text-red-500',
                    match.issue.severity === 'medium' && 'text-amber-500',
                    match.issue.severity === 'low' && 'text-yellow-500'
                  )} />
                  <span className="font-medium capitalize">{match.issue.severity} Risk</span>
                </div>
                <p className="text-sm">{match.issue.explanation}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Lightbulb className="h-3 w-3" />
                  {match.issue.suggestion}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      lastIndex = match.index + match.word.length;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      elements.push(text.slice(lastIndex));
    }

    return elements;
  };

  const spamIssues = findSpamIssues(email.body + ' ' + email.subject);

  const handleSave = () => {
    onEdit?.(editedSubject, editedBody);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedSubject(email.subject);
    setEditedBody(email.body);
    setIsEditing(false);
  };

  // Calculate warmth score based on personalization
  const warmthScore = Math.min(95, Math.max(20, 
    email.qualityScore * 0.6 + 
    (100 - email.spamScore) * 0.2 +
    (lead?.personalTouch ? 20 : 0)
  ));

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/30 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">To: {lead?.name || 'Recipient'}</p>
            <p className="text-sm text-muted-foreground">{lead?.email || 'email@example.com'}</p>
          </div>
          <Badge
            variant={email.status === 'sent' ? 'default' : 'secondary'}
            className="capitalize"
          >
            {email.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Subject */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Subject</label>
          {isEditing ? (
            <Input
              value={editedSubject}
              onChange={(e) => setEditedSubject(e.target.value)}
              className="font-medium"
            />
          ) : (
            <p className="font-medium text-lg">{highlightSpamWords(email.subject)}</p>
          )}
        </div>

        {/* Body */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Body</label>
          {isEditing ? (
            <Textarea
              value={editedBody}
              onChange={(e) => setEditedBody(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
          ) : (
            <div className="rounded-lg bg-muted/30 p-4" data-tour="email-body">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {highlightSpamWords(email.body)}
              </pre>
            </div>
          )}
        </div>

        {/* Spam Issues Panel */}
        {spamIssues.length > 0 && (
          <Collapsible open={spamPanelOpen} onOpenChange={setSpamPanelOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-between',
                  spamIssues.some(i => i.severity === 'high') && 'border-red-300 dark:border-red-800'
                )}
              >
                <span className="flex items-center gap-2">
                  <AlertTriangle className={cn(
                    'h-4 w-4',
                    spamIssues.some(i => i.severity === 'high') ? 'text-red-500' : 'text-amber-500'
                  )} />
                  {spamIssues.length} Spam Issue{spamIssues.length !== 1 ? 's' : ''} Detected
                </span>
                <motion.div
                  animate={{ rotate: spamPanelOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 space-y-2"
              >
                {spamIssues.map((issue, index) => (
                  <motion.div
                    key={issue.word}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-lg',
                      issue.severity === 'high' && 'bg-red-50 dark:bg-red-900/20',
                      issue.severity === 'medium' && 'bg-amber-50 dark:bg-amber-900/20',
                      issue.severity === 'low' && 'bg-yellow-50 dark:bg-yellow-900/20'
                    )}
                  >
                    <AlertTriangle className={cn(
                      'h-4 w-4 mt-0.5 shrink-0',
                      issue.severity === 'high' && 'text-red-500',
                      issue.severity === 'medium' && 'text-amber-500',
                      issue.severity === 'low' && 'text-yellow-600'
                    )} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">"{issue.word}"</span>
                        <Badge variant="outline" className={cn(
                          'text-xs capitalize',
                          issue.severity === 'high' && 'border-red-300 text-red-600',
                          issue.severity === 'medium' && 'border-amber-300 text-amber-600',
                          issue.severity === 'low' && 'border-yellow-300 text-yellow-600'
                        )}>
                          {issue.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{issue.explanation}</p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Lightbulb className="h-3 w-3 text-primary" />
                        <span className="text-primary">{issue.suggestion}</span>
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Scores */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="space-y-3" data-tour="spam-score">
            <h4 className="text-sm font-medium">Spam Score</h4>
            <SpamScoreGauge score={email.spamScore} />
          </div>
          <div className="space-y-3" data-tour="quality-score">
            <h4 className="text-sm font-medium">Quality Score</h4>
            <QualityScoreGauge score={email.qualityScore} />
          </div>
          <div className="space-y-3" data-tour="warmth-meter">
            <h4 className="text-sm font-medium">Warmth</h4>
            <WarmthMeter score={warmthScore} showBreakdown={false} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t">
          {isEditing ? (
            <>
              <Button onClick={handleSave} className="gap-2">
                <Check className="h-4 w-4" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel} className="gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button onClick={onRegenerate} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Regenerate
              </Button>
              <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
                <Edit3 className="h-4 w-4" />
                Edit
              </Button>
              <Button 
                onClick={onSend} 
                className="gap-2 gradient-primary text-white"
                disabled={email.status === 'sent'}
              >
                <Send className="h-4 w-4" />
                {email.status === 'sent' ? 'Sent' : 'Send Email'}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
