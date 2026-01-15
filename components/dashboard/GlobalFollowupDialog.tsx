"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Clock, Send, AlertTriangle, Mail, MailOpen } from "lucide-react"
import { globalStats } from "@/lib/data"

interface GlobalFollowupDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function GlobalFollowupDialog({ open, onOpenChange }: GlobalFollowupDialogProps) {
    const [timeLimit, setTimeLimit] = useState("48")

    // Calculate counts from global stats
    const totalUnopenedCount = Math.floor(globalStats.totalSent - globalStats.totalOpens)
    const totalOpenedNotReplied = Math.floor(globalStats.totalOpens - globalStats.totalReplies)
    const totalNeedsFollowup = totalUnopenedCount + totalOpenedNotReplied

    const handleSend = () => {
        console.log(`Sending follow-ups across all campaigns with ${timeLimit}h limit to ${totalNeedsFollowup} contacts`)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-base flex items-center gap-2">
                        <Send className="h-4 w-4 text-primary" />
                        Send Follow-ups (All Campaigns)
                    </DialogTitle>
                </DialogHeader>

                <div className="py-3 space-y-4">
                    {/* Summary with icons */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-3">
                            <div className="p-2 rounded-full bg-muted">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-[10px] text-muted-foreground">Unopened</p>
                                <p className="text-xl font-bold text-foreground">{totalUnopenedCount.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-3">
                            <div className="p-2 rounded-full bg-amber-500/10">
                                <MailOpen className="h-4 w-4 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-[10px] text-muted-foreground">Opened (no reply)</p>
                                <p className="text-xl font-bold text-foreground">{totalOpenedNotReplied.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="text-center py-2 border-y border-border/50">
                        <p className="text-[10px] text-muted-foreground">Total emails to follow up</p>
                        <p className="text-2xl font-bold text-primary">{totalNeedsFollowup.toLocaleString()}</p>
                    </div>

                    {/* Time limit options */}
                    <div className="space-y-2">
                        <Label className="text-xs font-medium flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            Minimum wait time since initial email
                        </Label>
                        <RadioGroup value={timeLimit} onValueChange={setTimeLimit} className="grid grid-cols-2 gap-2">
                            {[
                                { value: "24", label: "24 hours" },
                                { value: "36", label: "36 hours" },
                                { value: "48", label: "48 hours", recommended: true },
                                { value: "72", label: "72 hours" },
                            ].map((opt) => (
                                <div
                                    key={opt.value}
                                    className="flex items-center space-x-2 p-2 rounded-lg border border-border/50 hover:bg-muted/30"
                                >
                                    <RadioGroupItem value={opt.value} id={`global-${opt.value}h`} />
                                    <Label htmlFor={`global-${opt.value}h`} className="text-xs cursor-pointer flex-1">
                                        {opt.label}
                                        {opt.recommended && <span className="text-primary ml-1">(Rec)</span>}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-border/50 hover:bg-muted/30">
                            <RadioGroupItem value="0" id="global-all" />
                            <Label htmlFor="global-all" className="text-xs cursor-pointer">
                                Send to all (no time limit)
                            </Label>
                        </div>
                    </div>

                    {/* Warning for aggressive option */}
                    {timeLimit === "0" && (
                        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/10 text-amber-700 text-[11px]">
                            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                            <p>Sending follow-ups too soon may appear too eager and reduce response rates.</p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button size="sm" onClick={handleSend}>
                        <Send className="mr-2 h-3.5 w-3.5" />
                        Send Follow-ups
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
