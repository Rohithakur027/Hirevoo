'use client';

import { EmailTone } from '@/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Briefcase, Coffee, Heart } from 'lucide-react';

interface ToneSelectorProps {
  value: EmailTone;
  onChange: (value: EmailTone) => void;
}

const tones = [
  {
    value: 'professional' as EmailTone,
    label: 'Professional',
    description: 'Formal and business-oriented tone',
    icon: Briefcase,
  },
  {
    value: 'casual' as EmailTone,
    label: 'Casual',
    description: 'Relaxed and conversational tone',
    icon: Coffee,
  },
  {
    value: 'friendly' as EmailTone,
    label: 'Friendly',
    description: 'Warm and personable tone',
    icon: Heart,
  },
];

export function ToneSelector({ value, onChange }: ToneSelectorProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(v) => onChange(v as EmailTone)}
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      {tones.map((tone) => (
        <Label
          key={tone.value}
          htmlFor={tone.value}
          className={cn(
            'flex flex-col items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all',
            value === tone.value
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-muted/50'
          )}
        >
          <RadioGroupItem value={tone.value} id={tone.value} className="sr-only" />
          <div
            className={cn(
              'rounded-full p-3',
              value === tone.value ? 'bg-primary/10' : 'bg-muted'
            )}
          >
            <tone.icon
              className={cn(
                'h-6 w-6',
                value === tone.value ? 'text-primary' : 'text-muted-foreground'
              )}
            />
          </div>
          <div className="text-center">
            <p className={cn('font-medium', value === tone.value && 'text-primary')}>
              {tone.label}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{tone.description}</p>
          </div>
        </Label>
      ))}
    </RadioGroup>
  );
}
