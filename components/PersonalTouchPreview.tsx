'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Wand2 } from 'lucide-react';

interface PersonalTouchPreviewProps {
  personalTouch: string;
  leadName?: string;
  companyName?: string;
}

export function PersonalTouchPreview({
  personalTouch,
  leadName = 'Sarah',
  companyName = 'TechCorp',
}: PersonalTouchPreviewProps) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const prevTouchRef = useRef('');

  // Generate a preview email snippet based on personal touch
  const generatePreview = (touch: string): string => {
    if (!touch || touch.length < 10) {
      return `Hi ${leadName},\n\nI noticed you're at ${companyName} and wanted to reach out...`;
    }

    // Extract key elements from personal touch
    const keywords = touch.toLowerCase();
    
    if (keywords.includes('conference') || keywords.includes('event') || keywords.includes('met')) {
      return `Hi ${leadName},\n\nGreat meeting you at the event! Your insights on ${touch.split(' ').slice(0, 5).join(' ')}... really resonated with me.\n\nI'd love to continue our conversation about how we might help ${companyName}...`;
    }
    
    if (keywords.includes('linkedin') || keywords.includes('post') || keywords.includes('article')) {
      return `Hi ${leadName},\n\nYour recent post caught my attention - "${touch.split(' ').slice(0, 8).join(' ')}..." \n\nIt's clear you're thinking deeply about this space, and I believe we could add value to ${companyName}'s approach...`;
    }
    
    if (keywords.includes('spoke') || keywords.includes('talk') || keywords.includes('presentation')) {
      return `Hi ${leadName},\n\nI caught your talk on ${touch.split(' ').slice(0, 6).join(' ')}... - incredibly insightful!\n\nYour perspective on this aligns perfectly with what we're building, and I think ${companyName} would benefit from...`;
    }

    // Default personalized opening
    return `Hi ${leadName},\n\n${touch.charAt(0).toUpperCase() + touch.slice(0, 50)}... caught my attention.\n\nI'd love to share how this connects to what we're doing at ${companyName}...`;
  };

  // Typing animation effect
  useEffect(() => {
    if (personalTouch === prevTouchRef.current) return;
    prevTouchRef.current = personalTouch;

    const targetText = generatePreview(personalTouch);
    setIsTyping(true);
    setDisplayText('');

    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < targetText.length) {
        setDisplayText(targetText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 20);

    return () => clearInterval(typingInterval);
  }, [personalTouch, leadName, companyName]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <motion.div
              animate={isTyping ? { rotate: [0, 15, -15, 0] } : {}}
              transition={{ duration: 0.5, repeat: isTyping ? Infinity : 0 }}
            >
              <Wand2 className="h-4 w-4 text-primary" />
            </motion.div>
            <span>AI Preview</span>
            <AnimatePresence>
              {isTyping && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-xs text-primary ml-auto flex items-center gap-1"
                >
                  <Wand2 className="h-3 w-3" />
                  Generating...
                </motion.span>
              )}
            </AnimatePresence>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative min-h-[140px] rounded-lg bg-background/50 p-4 font-mono text-sm">
            <pre className="whitespace-pre-wrap text-muted-foreground">
              {displayText}
              {isTyping && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block w-2 h-4 bg-primary ml-0.5 align-middle"
                />
              )}
            </pre>
            
            {/* Highlight effect for personalized parts */}
            {personalTouch && personalTouch.length >= 10 && !isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-2 right-2"
              >
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                  <Wand2 className="h-3 w-3" />
                  Personalized
                </span>
              </motion.div>
            )}
          </div>
          
          {/* Tips section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-xs text-muted-foreground"
          >
            <p className="flex items-center gap-1">
              <span className="text-primary">💡</span>
              {personalTouch.length < 10 
                ? "Add more context for better personalization"
                : personalTouch.length < 30
                ? "Good start! Add specific details for even better results"
                : "Great! Your personal touch will make this email stand out"}
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
