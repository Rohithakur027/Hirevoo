'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Star, Zap, BookOpen, HelpCircle, Check, Shuffle } from 'lucide-react';

interface EmailVariation {
  id: string;
  type: 'direct' | 'story' | 'question';
  label: string;
  description: string;
  icon: typeof Zap;
  subject: string;
  body: string;
}

interface EmailVariationsProps {
  leadName: string;
  companyName: string;
  personalTouch: string;
  onSelect: (variation: EmailVariation) => void;
}

export function EmailVariations({
  leadName,
  companyName,
  personalTouch,
  onSelect,
}: EmailVariationsProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);

  const variations: EmailVariation[] = [
    {
      id: 'direct',
      type: 'direct',
      label: 'Direct & Concise',
      description: 'Straight to the point, respects their time',
      icon: Zap,
      subject: `Quick question, ${leadName}`,
      body: `Hi ${leadName},

${personalTouch ? `I noticed ${personalTouch.slice(0, 50)}...` : `I've been following ${companyName}'s work`} and wanted to reach out directly.

We help companies like yours increase response rates by 3x with AI-personalized outreach.

Worth a 15-minute call this week?

Best,`,
    },
    {
      id: 'story',
      type: 'story',
      label: 'Story-led & Engaging',
      description: 'Opens with a relatable narrative',
      icon: BookOpen,
      subject: `A story that reminded me of ${companyName}`,
      body: `Hi ${leadName},

Last week, I was talking to a founder who described their outreach process as "throwing spaghetti at the wall." Sound familiar?

${personalTouch ? `When I saw ${personalTouch.slice(0, 40)}..., I knew you might relate.` : `That's when I thought of ${companyName}.`}

We've helped teams just like yours transform their outreach from guesswork to precision. The results? 3x more replies, 50% less time spent.

Would love to share how we could help ${companyName} achieve similar results.

Cheers,`,
    },
    {
      id: 'question',
      type: 'question',
      label: 'Question-led & Curious',
      description: 'Starts with thought-provoking question',
      icon: HelpCircle,
      subject: `${leadName}, quick question about ${companyName}'s outreach`,
      body: `Hi ${leadName},

What if your team could send half the emails but get twice the responses?

${personalTouch ? `Given ${personalTouch.slice(0, 40)}..., I bet you've thought about this.` : `At ${companyName}, I imagine personalization at scale is a challenge.`}

I'm curious - how are you currently handling outreach personalization? We've been working on something that might be interesting.

No pitch, just genuinely curious about your approach.

Best,`,
    },
  ];

  const handleSelect = (variation: EmailVariation) => {
    setSelectedId(variation.id);
    onSelect(variation);
  };

  const handleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteId(favoriteId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Shuffle className="h-5 w-5 text-primary" />
          Email Variations
        </h3>
        <Badge variant="secondary" className="text-xs">
          Pick your style
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {variations.map((variation, index) => (
          <motion.div
            key={variation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={cn(
                'cursor-pointer transition-all duration-300 hover:shadow-lg relative overflow-hidden group',
                selectedId === variation.id
                  ? 'ring-2 ring-primary border-primary'
                  : 'hover:border-primary/50',
                favoriteId === variation.id && 'bg-amber-50/50 dark:bg-amber-900/10'
              )}
              onClick={() => handleSelect(variation)}
            >
              {/* Selection indicator */}
              <AnimatePresence>
                {selectedId === variation.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-2 right-2 z-10"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <div className={cn(
                    'p-1.5 rounded-lg transition-colors',
                    selectedId === variation.id ? 'bg-primary/10' : 'bg-muted group-hover:bg-primary/10'
                  )}>
                    <variation.icon className={cn(
                      'h-4 w-4',
                      selectedId === variation.id ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                    )} />
                  </div>
                  <span>{variation.label}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto h-6 w-6"
                    onClick={(e) => handleFavorite(variation.id, e)}
                  >
                    <Star
                      className={cn(
                        'h-4 w-4 transition-colors',
                        favoriteId === variation.id
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-muted-foreground hover:text-amber-400'
                      )}
                    />
                  </Button>
                </CardTitle>
                <p className="text-xs text-muted-foreground">{variation.description}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Subject preview */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Subject:</p>
                  <p className="text-sm font-medium truncate">{variation.subject}</p>
                </div>

                {/* Body preview */}
                <div className="relative">
                  <p className="text-xs text-muted-foreground mb-1">Preview:</p>
                  <div className="text-xs text-muted-foreground line-clamp-4 bg-muted/50 rounded-lg p-2">
                    {variation.body.slice(0, 150)}...
                  </div>
                  
                  {/* Fade effect */}
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent pointer-events-none" />
                </div>
              </CardContent>

              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 pointer-events-none"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Selected variation full preview */}
      <AnimatePresence>
        {selectedId && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mt-4 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Selected: {variations.find(v => v.id === selectedId)?.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Subject</p>
                    <p className="font-medium">{variations.find(v => v.id === selectedId)?.subject}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Body</p>
                    <pre className="whitespace-pre-wrap text-sm bg-muted/30 rounded-lg p-3 mt-1">
                      {variations.find(v => v.id === selectedId)?.body}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
