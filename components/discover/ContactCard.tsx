'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Contact } from '@/types';
import { cn } from '@/lib/utils';
import { User, Mail, Linkedin, Star, Plus, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface ContactCardProps {
  contact: Contact;
  isRecommended?: boolean;
  onAddToApplications?: (contact: Contact) => void;
  index?: number;
}

export function ContactCard({ 
  contact, 
  isRecommended = false, 
  onAddToApplications,
  index = 0 
}: ContactCardProps) {
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    setIsAdded(true);
    onAddToApplications?.(contact);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-emerald-600 dark:text-emerald-400';
    if (confidence >= 70) return 'text-blue-600 dark:text-blue-400';
    return 'text-amber-600 dark:text-amber-400';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 90) return 'Verified';
    if (confidence >= 70) return 'Likely';
    return 'Possible';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={cn(
        'transition-all duration-200',
        isRecommended && 'border-primary/50 bg-primary/5',
        isAdded && 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800'
      )}>
        <CardContent className="p-4">
          {/* Recommended Badge */}
          {isRecommended && (
            <div className="flex items-center gap-1 text-primary text-sm font-medium mb-3">
              <Star className="h-4 w-4 fill-primary" />
              RECOMMENDED
            </div>
          )}

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center',
                isRecommended ? 'bg-primary/20' : 'bg-muted'
              )}>
                <User className={cn('h-5 w-5', isRecommended ? 'text-primary' : 'text-muted-foreground')} />
              </div>

              {/* Info */}
              <div>
                <h4 className="font-semibold">{contact.name}</h4>
                <p className="text-sm text-muted-foreground">{contact.role}</p>

                {/* Email */}
                {contact.email && (
                  <div className="flex items-center gap-2 mt-2">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm">{contact.email}</span>
                    <Badge variant="outline" className={cn('text-[10px] px-1.5', getConfidenceColor(contact.emailConfidence))}>
                      {getConfidenceLabel(contact.emailConfidence)} ✓
                    </Badge>
                  </div>
                )}

                {/* LinkedIn */}
                {contact.linkedinUrl && (
                  <a
                    href={contact.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 mt-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Linkedin className="h-3.5 w-3.5" />
                    LinkedIn Profile
                  </a>
                )}

                {/* Why Contact */}
                <p className="text-xs text-muted-foreground mt-2 italic">
                  "{contact.whyContact}"
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div>
              {isAdded ? (
                <Button size="sm" variant="outline" disabled className="gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Added
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  onClick={handleAdd}
                  className={cn(
                    'gap-1',
                    isRecommended && 'gradient-primary text-white'
                  )}
                  variant={isRecommended ? 'default' : 'outline'}
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
