"use client"

import { useState } from "react"
import { User, CheckCircle, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface Contact {
  id: string
  name: string
  email: string
  company?: string
  emailStatus: "pending" | "draft" | "done"
  emailSubject?: string
  emailBody?: string
}

interface ContactsListProps {
  contacts: Contact[]
  selectedContactId?: string
  onSelectContact: (contact: Contact) => void
}

export function ContactsList({ contacts, selectedContactId, onSelectContact }: ContactsListProps) {
  const [search, setSearch] = useState("")

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(search.toLowerCase()) ||
      contact.email.toLowerCase().includes(search.toLowerCase()) ||
      contact.company?.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <Card className="flex flex-col h-full bg-card border border-border overflow-hidden rounded-lg">
      <div className="px-2.5 sm:px-3 py-1.5 sm:py-2 border-b border-border flex-shrink-0">
        <h3 className="text-xs font-semibold text-foreground mb-1">Email</h3>
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 sm:h-8 text-xs px-2 py-1"
        />
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        {filteredContacts.length === 0 ? (
          <div className="p-2 text-center text-xs text-muted-foreground">No contacts</div>
        ) : (
          <div className="space-y-0 p-0">
            {filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => onSelectContact(contact)}
                className={cn(
                  "w-full text-left px-2 py-1.5 sm:py-2 rounded-none transition-colors text-xs border-b border-border/40 last:border-b-0",
                  "hover:bg-muted/50 active:bg-muted/60",
                  selectedContactId === contact.id ? "bg-primary/10 hover:bg-primary/15" : "",
                )}
              >
                <div className="flex items-start gap-1.5 sm:gap-2">
                  <div className="mt-0.5 flex-shrink-0 w-4 h-4 flex items-center justify-center">
                    {contact.emailStatus === "done" ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    ) : contact.emailStatus === "draft" ? (
                      <Clock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    ) : contact.emailStatus === "pending" ? (
                      <User className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-xs leading-tight">{contact.name}</p>
                    <p className="text-xs text-muted-foreground truncate leading-tight">{contact.email}</p>
                    {contact.company && (
                      <p className="text-xs text-muted-foreground truncate leading-tight">{contact.company}</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {contacts.length > 0 && (
        <div className="border-t border-border px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs text-muted-foreground flex-shrink-0">
          <div className="flex justify-between items-center">
            <span>Total: {contacts.length}</span>
            <span>Done: {contacts.filter((c) => c.emailStatus === "done").length}</span>
          </div>
        </div>
      )}
    </Card>
  )
}
