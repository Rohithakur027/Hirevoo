"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Send, Eye, Zap, CheckCircle } from "lucide-react"
import { getHoursSince, formatShortDate } from "@/lib/date-helpers"
import { IndividualFollowupDialog } from "./IndividualFollowupDialog"
import { EmailChatDialog } from "./EmailChatDialog"
import { BulkFollowupDialog } from "./BulkFollowupDialog"
import type { Recipient } from "@/lib/data"

interface RecipientTableProps {
    recipients: Recipient[]
}

export function RecipientTable({ recipients: initialRecipients }: RecipientTableProps) {
    const [recipients] = useState(initialRecipients)
    const [showFollowUpDialog, setShowFollowUpDialog] = useState(false)
    const [followUpRecipient, setFollowUpRecipient] = useState<Recipient | null>(null)
    const [chatRecipient, setChatRecipient] = useState<Recipient | null>(null)
    const [showChatDialog, setShowChatDialog] = useState(false)
    const [showBulkFollowup, setShowBulkFollowup] = useState(false)

    const handleFollowUp = (recipient: Recipient) => {
        setFollowUpRecipient(recipient)
        setShowFollowUpDialog(true)
    }

    const handleViewChat = (recipient: Recipient) => {
        setChatRecipient(recipient)
        setShowChatDialog(true)
    }

    const getStatusBadge = (status: Recipient["status"]) => {
        switch (status) {
            case "Replied":
                return (
                    <Badge className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/20 text-[9px] px-1.5 py-0 h-4 shadow-none border-0">
                        Replied
                    </Badge>
                )
            case "Opened":
                return (
                    <Badge className="bg-amber-500/15 text-amber-600 hover:bg-amber-500/20 text-[9px] px-1.5 py-0 h-4 shadow-none border-0">
                        Opened
                    </Badge>
                )
            case "Sent":
                return <Badge className="bg-muted text-muted-foreground hover:bg-muted text-[9px] px-1.5 py-0 h-4 shadow-none border-0">Sent</Badge>
        }
    }

    const shouldShowFollowUp = (recipient: Recipient) => {
        return recipient.status === "Sent" || recipient.status === "Opened"
    }

    const needsFollowupCount = recipients.filter((r) => r.status !== "Replied").length

    return (
        <>
            <Card className="flex h-full flex-col border-border/50 shadow-sm">
                <CardHeader className="flex-shrink-0 pb-3 pt-4 px-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-sm font-semibold">Email List</CardTitle>
                            <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium">
                                {recipients.length} contacts
                            </span>
                        </div>
                        <Button size="sm" className="h-7 text-[10px] gap-1.5 bg-violet-600 hover:bg-violet-700 text-white" onClick={() => setShowBulkFollowup(true)}>
                            <Zap className="h-3 w-3" />
                            Quick Follow-up ({needsFollowupCount})
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto px-0 pb-2">
                    <table className="w-full">
                        <thead className="sticky top-0 bg-card z-10">
                            <tr className="border-b border-border/50">
                                <th className="pb-2 w-[40%] pl-4 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Contact</th>
                                <th className="pb-2 w-[50px] text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">View</th>
                                <th className="pb-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                                <th className="pb-2 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                                <th className="pb-2 pr-4 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {recipients.map((recipient) => (
                                <tr key={recipient.id} className="group hover:bg-muted/30 transition-colors">
                                    <td className="py-2.5 pl-4">
                                        <div className="flex flex-col">
                                            <p className="text-[11px] font-medium text-foreground truncate max-w-[180px]">{recipient.name}</p>
                                            <p className="text-[10px] text-muted-foreground truncate max-w-[180px]">{recipient.email}</p>
                                        </div>
                                    </td>
                                    <td className="py-2.5 text-center w-[50px]">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0 hover:bg-violet-50 hover:text-violet-600 rounded-full"
                                            onClick={() => handleViewChat(recipient)}
                                            title="View conversation"
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                        </Button>
                                    </td>
                                    <td className="py-2.5 text-left">
                                        <span className="text-[10px] text-muted-foreground font-medium">{formatShortDate(recipient.sentAt)}</span>
                                    </td>
                                    <td className="py-2.5 text-center">{getStatusBadge(recipient.status)}</td>
                                    <td className="py-2.5 pr-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {/* Follow-up Button */}
                                            {shouldShowFollowUp(recipient) ? (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 px-2 text-[10px] hover:bg-violet-50 hover:text-violet-600 rounded-full"
                                                    onClick={() => handleFollowUp(recipient)}
                                                >
                                                    <Send className="mr-1 h-3 w-3" />
                                                    Follow Up
                                                </Button>
                                            ) : (
                                                <span className="text-[10px] text-emerald-600 px-2 font-medium flex items-center">
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Done
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {recipients.length === 0 && (
                        <div className="py-8 text-center text-xs text-muted-foreground">No recipients found.</div>
                    )}
                </CardContent>
            </Card>

            {/* Individual Follow-up Dialog */}
            <IndividualFollowupDialog recipient={followUpRecipient} open={showFollowUpDialog} onOpenChange={setShowFollowUpDialog} />

            {/* Email Chat Dialog */}
            <EmailChatDialog recipient={chatRecipient} open={showChatDialog} onOpenChange={setShowChatDialog} />

            {/* Bulk Follow-up Dialog */}
            <BulkFollowupDialog recipients={recipients} open={showBulkFollowup} onOpenChange={setShowBulkFollowup} />
        </>
    )
}
