"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { EmailEditor } from "@/components/campaigns/compose-ui/email-editor"
import type { Recipient } from "@/lib/data"

interface IndividualFollowupDialogProps {
    recipient: Recipient | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function IndividualFollowupDialog({ recipient, open, onOpenChange }: IndividualFollowupDialogProps) {
    const [subject, setSubject] = useState("Following up: Your application")
    const [emailBody, setEmailBody] = useState(`Hi ${recipient?.name || 'there'},\n\nI wanted to follow up on my previous email...`)
    const [useTemplate, setUseTemplate] = useState(false)

    if (!recipient) return null

    // Mock Contact object for EmailEditor
    const contact = {
        id: recipient.id,
        name: recipient.name,
        email: recipient.email,
        company: "Unknown Company", // or derive from recipient if available
        role: "Contact",
        status: "todo" as const,
        avatar: "",
        avatarColor: "bg-blue-500"
    }

    const handleSend = () => {
        console.log("Sending individual follow-up to", recipient.email)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[80vh] p-0 overflow-hidden flex flex-col gap-0 border-none bg-background">
                <EmailEditor
                    selectedContact={contact}
                    subject={subject}
                    setSubject={setSubject}
                    emailBody={emailBody}
                    setEmailBody={setEmailBody}
                    useTemplateForAll={useTemplate}
                    setUseTemplateForAll={setUseTemplate}
                    onOpenTemplates={() => { }}
                    onOpenAI={() => { }}
                    onOpenSaveTemplate={() => { }}
                    onDoneAndNext={handleSend}
                    onPrevious={() => { }}
                    isLastContact={true}
                    isFirstContact={true}
                    allReady={true}
                    currentIndex={0}
                    totalContacts={1}
                    submitLabel="Send Email"
                    onSend={handleSend}
                />
            </DialogContent>
        </Dialog>
    )
}
