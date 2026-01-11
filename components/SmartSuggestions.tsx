'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Lightbulb,
  Plus,
  Wand2,
  TrendingUp,
  Building2,
  Linkedin,
  Award,
  Code2,
  RefreshCw,
} from 'lucide-react';

interface Suggestion {
  id: string;
  type: 'milestone' | 'social' | 'tech' | 'achievement' | 'connection';
  icon: typeof Lightbulb;
  title: string;
  description: string;
  snippet: string;
  confidence: number;
}

interface SmartSuggestionsProps {
  leadName: string;
  companyName: string;
  currentTouch: string;
  onAddSuggestion: (snippet: string) => void;
}

export function SmartSuggestions({
  leadName,
  companyName,
  currentTouch,
  onAddSuggestion,
}: SmartSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  // Generate contextual suggestions
  const generateSuggestions = (): Suggestion[] => {
    const baseSuggestions: Suggestion[] = [
      {
        id: 'milestone-1',
        type: 'milestone',
        icon: TrendingUp,
        title: 'Recent Company Milestone',
        description: `${companyName} recently expanded to new markets`,
        snippet: `Congrats on ${companyName}'s recent expansion - impressive growth trajectory!`,
        confidence: 92,
      },
      {
        id: 'social-1',
        type: 'social',
        icon: Linkedin,
        title: 'LinkedIn Activity',
        description: `${leadName} posted about AI challenges`,
        snippet: `Your LinkedIn post about AI implementation challenges really resonated with me`,
        confidence: 88,
      },
      {
        id: 'tech-1',
        type: 'tech',
        icon: Code2,
        title: 'Tech Stack Detection',
        description: `${companyName} uses React & Node.js`,
        snippet: `I noticed ${companyName} is building with React - we integrate seamlessly with your stack`,
        confidence: 85,
      },
      {
        id: 'achievement-1',
        type: 'achievement',
        icon: Award,
        title: 'Industry Recognition',
        description: `${leadName} was featured in Forbes`,
        snippet: `Congrats on the Forbes feature! Your insights on ${companyName}'s growth strategy were spot-on`,
        confidence: 95,
      },
      {
        id: 'connection-1',
        type: 'connection',
        icon: Building2,
        title: 'Shared Connection',
        description: `You both know Sarah from Acme Inc`,
        snippet: `Sarah at Acme mentioned you might be interested in what we're building`,
        confidence: 78,
      },
    ];

    // Filter out suggestions that are already in the current touch
    return baseSuggestions.filter(
      s => !currentTouch.toLowerCase().includes(s.snippet.toLowerCase().slice(0, 20))
    );
  };

  useEffect(() => {
    setSuggestions(generateSuggestions());
  }, [leadName, companyName]);

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setSuggestions(generateSuggestions().sort(() => Math.random() - 0.5));
    setIsLoading(false);
  };

  const handleAddSuggestion = (suggestion: Suggestion) => {
    onAddSuggestion(suggestion.snippet);
    setAddedIds(new Set([...addedIds, suggestion.id]));
  };

  const getTypeColor = (type: Suggestion['type']) => {
    switch (type) {
      case 'milestone': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'social': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'tech': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'achievement': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'connection': return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Lightbulb className="h-4 w-4 text-amber-500" />
            </motion.div>
            Smart Suggestions
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-7 px-2"
          >
            <RefreshCw className={cn('h-3 w-3', isLoading && 'animate-spin')} />
          </Button>
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          AI-detected insights about {leadName}
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        <AnimatePresence mode="popLayout">
          {suggestions.slice(0, 4).map((suggestion, index) => (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ delay: index * 0.1 }}
              layout
            >
              <div
                className={cn(
                  'group relative rounded-lg border p-3 transition-all duration-200',
                  addedIds.has(suggestion.id)
                    ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800'
                    : 'hover:border-primary/50 hover:bg-muted/50'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn('rounded-lg p-1.5', getTypeColor(suggestion.type))}>
                    <suggestion.icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{suggestion.title}</span>
                      <Badge variant="secondary" className="text-[10px] px-1 py-0">
                        {suggestion.confidence}% match
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {suggestion.description}
                    </p>
                    <div className="relative">
                      <p className="text-xs italic text-muted-foreground bg-muted/50 rounded p-2 pr-16">
                        "{suggestion.snippet}"
                      </p>
                      {!addedIds.has(suggestion.id) ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleAddSuggestion(suggestion)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      ) : (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                        >
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px]">
                            Added ✓
                          </Badge>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Confidence indicator */}
                <div className="absolute bottom-1 left-3 right-3">
                  <div className="h-0.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${suggestion.confidence}%` }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                      className="h-full bg-primary/50"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* More suggestions hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pt-2 text-center"
        >
          <Button variant="link" size="sm" className="text-xs text-muted-foreground">
            <Wand2 className="h-3 w-3 mr-1" />
            Find more insights about {leadName}
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}
