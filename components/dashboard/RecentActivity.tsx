"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Eye, Send, Flame } from "lucide-react"
import type { RecentActivity as RecentActivityType } from "@/lib/data"

interface RecentActivityProps {
    activities: RecentActivityType[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
    const getIcon = (type: RecentActivityType["type"]) => {
        switch (type) {
            case "reply":
                return <MessageSquare className="h-3.5 w-3.5 text-emerald-500" />
            case "open":
                return <Eye className="h-3.5 w-3.5 text-amber-500" />
            case "sent":
                return <Send className="h-3.5 w-3.5 text-primary" />
        }
    }

    return (
        <Card className="flex h-full flex-col border-border/50">
            <CardHeader className="flex-shrink-0 pb-2 pt-3 px-3">
                <CardTitle className="text-xs font-semibold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto px-3 pb-3">
                <div className="space-y-3">
                    {activities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-2.5 text-xs">
                            <div className="mt-0.5 flex-shrink-0 p-1.5 rounded-full bg-muted/50">{getIcon(activity.type)}</div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1">
                                    <span className="font-medium text-foreground">{activity.contact}</span>
                                    {activity.isHighIntent && <Flame className="h-3 w-3 text-orange-500" />}
                                </div>
                                {activity.message && (
                                    <p className="text-muted-foreground truncate text-[11px]">&quot;{activity.message}&quot;</p>
                                )}
                                <p className="text-muted-foreground/70 text-[10px]">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
