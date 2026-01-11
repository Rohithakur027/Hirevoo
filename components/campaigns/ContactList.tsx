'use client';

import { motion } from 'framer-motion';
import { User, Building2, Check, Circle, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CampaignContact } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ContactListProps {
  contacts: CampaignContact[];
  currentContactId: string | null;
  onSelectContact: (contactId: string) => void;
}

export function ContactList({ contacts, currentContactId, onSelectContact }: ContactListProps) {
  const completedCount = contacts.filter(c => c.emailStatus === 'done').length;

  return (
    <div className="h-full flex flex-col bg-card rounded-lg border">
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="font-semibold">Contacts</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {completedCount}/{contacts.length} emails written
        </p>
        {/* Progress bar */}
        <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / contacts.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Contact List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {contacts.map((contact) => {
            const isCurrent = contact.id === currentContactId;
            const isDone = contact.emailStatus === 'done';
            const isDraft = contact.emailStatus === 'draft';

            return (
              <motion.button
                key={contact.id}
                onClick={() => onSelectContact(contact.id)}
                className={cn(
                  'w-full text-left p-3 rounded-lg transition-all',
                  'hover:bg-muted/80',
                  isCurrent && 'bg-primary/10 ring-1 ring-primary',
                  !isCurrent && 'bg-transparent'
                )}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-start gap-3">
                  {/* Status Indicator */}
                  <div
                    className={cn(
                      'mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0',
                      isDone && 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
                      isDraft && 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
                      !isDone && !isDraft && 'bg-muted text-muted-foreground'
                    )}
                  >
                    {isDone ? (
                      <Check className="w-3 h-3" />
                    ) : isDraft ? (
                      <Edit3 className="w-3 h-3" />
                    ) : (
                      <Circle className="w-3 h-3" />
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      <p className="font-medium text-sm truncate">{contact.name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {contact.email}
                    </p>
                    {contact.company && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <Building2 className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                        <p className="text-xs text-muted-foreground truncate">
                          {contact.company}
                          {contact.role && ` • ${contact.role}`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
