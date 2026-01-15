"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Send, MessageSquare, Flame, Download } from "lucide-react"

interface QuickActionsProps {
    followUpCount: number
    repliesCount: number
    hotLeadsCount: number
}

export function QuickActions({ followUpCount, repliesCount, hotLeadsCount }: QuickActionsProps) {
    return (
        <Card className="border-border/50">
            <CardContent className="p-2">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium text-muted-foreground px-1">Quick Actions</span>
                    <div className="flex flex-1 items-center gap-1.5">
                        <Button variant="outline" size="sm" className="h-7 flex-1 text-[10px] px-2 bg-transparent">
                            <Send className="mr-1 h-3 w-3" />
                            Follow Up ({followUpCount.toLocaleString()})
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 flex-1 text-[10px] px-2 bg-transparent">
                            <MessageSquare className="mr-1 h-3 w-3" />
                            Review ({repliesCount})
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 flex-1 text-[10px] px-2 bg-transparent">
                            <Flame className="mr-1 h-3 w-3 text-orange-500" />
                            Hot Leads ({hotLeadsCount})
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 text-[10px] px-2">
                            <Download className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
