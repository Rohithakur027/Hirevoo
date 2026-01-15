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
import { Send, Eye, Zap } from "lucide-react"
import { getHoursSince, formatShortDate } from "@/lib/date-helpers"
import { EmailChatDialog } from "./EmailChatDialog"
import { BulkFollowupDialog } from "./BulkFollowupDialog"
import type { Recipient } from "@/lib/data"

interface RecipientTableProps {
    recipients: Recipient[]
}

export function RecipientTable({ recipients: initialRecipients }: RecipientTableProps) {
    const [recipients] = useState(initialRecipients)
    const [showFollowUpAlert, setShowFollowUpAlert] = useState(false)
    const [followUpRecipient, setFollowUpRecipient] = useState<Recipient | null>(null)
    const [followUpHours, setFollowUpHours] = useState(0)
    const [chatRecipient, setChatRecipient] = useState<Recipient | null>(null)
    const [showChatDialog, setShowChatDialog] = useState(false)
    const [showBulkFollowup, setShowBulkFollowup] = useState(false)

    const handleFollowUp = (recipient: Recipient) => {
        const hours = getHoursSince(recipient.sentAt)
        if (hours < 48) {
            setFollowUpRecipient(recipient)
            setFollowUpHours(hours)
            setShowFollowUpAlert(true)
        } else {
            console.log("Following up with:", recipient.email)
        }
    }

    const handleViewChat = (recipient: Recipient) => {
        setChatRecipient(recipient)
        setShowChatDialog(true)
    }

    const getStatusBadge = (status: Recipient["status"]) => {
        switch (status) {
            case "Replied":
                return (
                    <Badge className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/20 text-[9px] px-1.5 py-0 h-4">
                        Replied
                    </Badge>
                )
            case "Opened":
                return (
                    <Badge className="bg-amber-500/15 text-amber-600 hover:bg-amber-500/20 text-[9px] px-1.5 py-0 h-4">
                        Opened
                    </Badge>
                )
            case "Sent":
                return <Badge className="bg-muted text-muted-foreground hover:bg-muted text-[9px] px-1.5 py-0 h-4">Sent</Badge>
        }
    }

    const shouldShowFollowUp = (recipient: Recipient) => {
        return recipient.status === "Sent" || recipient.status === "Opened"
    }

    const needsFollowupCount = recipients.filter((r) => r.status !== "Replied").length

    return (
        <>
            <Card className="flex h-full flex-col border-border/50">
                <CardHeader className="flex-shrink-0 pb-1 pt-2 px-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-xs font-semibold">Email List</CardTitle>
                            <span className="text-[9px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                {recipients.length} contacts
                            </span>
                        </div>
                        <Button size="sm" className="h-6 text-[10px] gap-1" onClick={() => setShowBulkFollowup(true)}>
                            <Zap className="h-3 w-3" />
                            Quick Follow-up ({needsFollowupCount})
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto px-3 pb-2">
                    <table className="w-full">
                        <thead className="sticky top-0 bg-card z-10">
                            <tr className="border-b border-border">
                                <th className="pb-1 text-left text-[9px] font-medium text-muted-foreground">Contact</th>
                                <th className="pb-1 text-center text-[9px] font-medium text-muted-foreground">Date</th>
                                <th className="pb-1 text-center text-[9px] font-medium text-muted-foreground">Status</th>
                                <th className="pb-1 text-center text-[9px] font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {recipients.map((recipient) => (
                                <tr key={recipient.id} className="group hover:bg-muted/30">
                                    <td className="py-1.5">
                                        <p className="text-[10px] font-medium text-foreground truncate max-w-[120px]">{recipient.name}</p>
                                        <p className="text-[9px] text-muted-foreground truncate max-w-[120px]">{recipient.email}</p>
                                    </td>
                                    <td className="py-1.5 text-center">
                                        <span className="text-[9px] text-muted-foreground">{formatShortDate(recipient.sentAt)}</span>
                                    </td>
                                    <td className="py-1.5 text-center">{getStatusBadge(recipient.status)}</td>
                                    <td className="py-1.5">
                                        <div className="flex items-center justify-center gap-1">
                                            {/* View Chat Button */}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-5 w-5 p-0"
                                                onClick={() => handleViewChat(recipient)}
                                                title="View conversation"
                                            >
                                                <Eye className="h-3 w-3" />
                                            </Button>
                                            {/* Follow-up Button */}
                                            {shouldShowFollowUp(recipient) ? (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-5 px-1.5 text-[9px]"
                                                    onClick={() => handleFollowUp(recipient)}
                                                >
                                                    <Send className="mr-0.5 h-2.5 w-2.5" />
                                                    Follow Up
                                                </Button>
                                            ) : (
                                                <span className="text-[9px] text-emerald-600 px-1.5">Done</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {recipients.length === 0 && (
                        <div className="py-3 text-center text-[10px] text-muted-foreground">No recipients found.</div>
                    )}
                </CardContent>
            </Card>

            {/* 48h Warning Dialog */}
            <AlertDialog open={showFollowUpAlert} onOpenChange={setShowFollowUpAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hold on a moment!</AlertDialogTitle>
                        <AlertDialogDescription>
                            It&apos;s only been <span className="font-semibold text-foreground">{followUpHours} hours</span> since you
                            sent this email to {followUpRecipient?.name}. Wait at least 2 days to avoid appearing too eager.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>I&apos;ll wait</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                console.log("Sending follow-up anyway to:", followUpRecipient?.email)
                            }}
                        >
                            Send anyway
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Email Chat Dialog */}
            <EmailChatDialog recipient={chatRecipient} open={showChatDialog} onOpenChange={setShowChatDialog} />

            {/* Bulk Follow-up Dialog */}
            <BulkFollowupDialog recipients={recipients} open={showBulkFollowup} onOpenChange={setShowBulkFollowup} />
        </>
    )
}
