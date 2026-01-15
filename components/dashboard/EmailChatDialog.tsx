"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExternalLink, AlertCircle } from "lucide-react"
import { getEmailConversation, type Recipient } from "@/lib/data"
import { cn } from "@/lib/utils"

interface EmailChatDialogProps {
    recipient: Recipient | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

function formatTime(isoString: string) {
    return new Date(isoString).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    })
}

export function EmailChatDialog({ recipient, open, onOpenChange }: EmailChatDialogProps) {
    if (!recipient) return null

    const messages = getEmailConversation(recipient.id)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
                <DialogHeader className="flex-shrink-0 pb-3 border-b">
                    <DialogTitle className="text-base">Conversation with {recipient.name}</DialogTitle>
                    <p className="text-xs text-muted-foreground">{recipient.email}</p>
                </DialogHeader>

                {/* Chat Messages - larger area */}
                <div className="flex-1 overflow-y-auto py-4 space-y-4 min-h-[300px]">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={cn(
                                "flex flex-col max-w-[75%]",
                                message.from === "user" ? "ml-auto items-end" : "mr-auto items-start",
                            )}
                        >
                            <div
                                className={cn(
                                    "rounded-2xl px-4 py-2.5 text-sm",
                                    message.from === "user"
                                        ? "bg-primary text-primary-foreground rounded-br-sm"
                                        : "bg-muted text-foreground rounded-bl-sm",
                                )}
                            >
                                {message.content}
                            </div>
                            <span className="text-[10px] text-muted-foreground mt-1.5 px-1">{formatTime(message.timestamp)}</span>
                        </div>
                    ))}
                </div>

                {/* Feature Notice */}
                <div className="flex-shrink-0 border-t pt-4">
                    <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-500/10 text-amber-700 text-xs">
                        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium">Reply feature coming soon!</p>
                            <p className="text-amber-600 mt-0.5">Use the Follow-up option in our app or reply directly in Gmail.</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-3 text-xs h-9 bg-transparent" asChild>
                        <a
                            href={`https://mail.google.com/mail/?view=cm&to=${recipient.email}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <ExternalLink className="mr-2 h-3.5 w-3.5" />
                            Reply in Gmail
                        </a>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
