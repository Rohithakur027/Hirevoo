"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, TrendingUp, Clock, AlertTriangle } from "lucide-react"

interface AIInsightsProps {
    urgentFollowUp: number
}

export function AIInsights({ urgentFollowUp }: AIInsightsProps) {
    return (
        <Card className="border-border/50">
            <CardHeader className="flex-shrink-0 pb-1 pt-3 px-3">
                <CardTitle className="flex items-center gap-1.5 text-xs font-semibold">
                    <Sparkles className="h-3 w-3 text-primary" />
                    AI Insights
                </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
                <div className="space-y-2 text-[11px]">
                    <div className="flex items-start gap-2">
                        <TrendingUp className="h-3 w-3 mt-0.5 text-emerald-500 flex-shrink-0" />
                        <p className="text-muted-foreground">
                            <span className="text-foreground font-medium">&quot;Quick question about [Company]&quot;</span> - 85% open
                            rate
                        </p>
                    </div>
                    <div className="flex items-start gap-2">
                        <Clock className="h-3 w-3 mt-0.5 text-primary flex-shrink-0" />
                        <p className="text-muted-foreground">
                            Best time: <span className="text-foreground">Tuesday 10 AM</span> (+32% opens)
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-3 w-3 text-amber-500 flex-shrink-0" />
                        <p className="text-muted-foreground flex-1">{urgentFollowUp} emails need follow-up</p>
                        <Button variant="link" size="sm" className="h-auto p-0 text-[10px] text-primary">
                            Act Now
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
