"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { RecentActivity as RecentActivityType } from "@/lib/data"

interface RecentActivityProps {
    activities: RecentActivityType[]
}

// Avatar colors for activities (rotating)
const avatarColors = [
    "bg-emerald-500",
    "bg-[#4553f4]",
    "bg-amber-500",
    "bg-rose-500",
    "bg-teal-500",
    "bg-purple-500",
    "bg-cyan-500",
]

function getInitials(name: string): string {
    return name
        .split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
}

// Mock campaign names for activities
const mockCampaigns = [
    "Process Nave Hire Pipework",
    "Address Employees Leave Request",
    "Review Open Positions",
    "Respond to Employer Sessions Inquiry",
    "Organize Compliance Training",
]

export function RecentActivity({ activities }: RecentActivityProps) {
    return (
        <div className="space-y-1">
            {activities.map((activity, index) => {
                const avatarColor = avatarColors[index % avatarColors.length]
                const initials = getInitials(activity.contact)
                const campaignName = mockCampaigns[index % mockCampaigns.length]
                const isOnline = activity.type === "reply" || activity.isHighIntent

                return (
                    <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                            <div className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-full text-white font-semibold text-xs",
                                avatarColor
                            )}>
                                {initials}
                            </div>
                            {isOnline && (
                                <div className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-foreground">
                                    {activity.contact}
                                </span>
                                {isOnline && (
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                                {campaignName}
                            </p>
                            {activity.message && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {activity.message}
                                </p>
                            )}
                        </div>

                        {/* Time */}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                            <Clock className="h-3 w-3" />
                            <span>{activity.time}</span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

// Standalone Recent Activity Card for use in sidebar
export function RecentActivityCard({ activities }: RecentActivityProps) {
    return (
        <Card className="flex h-full flex-col border-border/40 bg-white shadow-sm">
            <CardHeader className="flex-shrink-0 pb-2 pt-4 px-4">
                <CardTitle className="text-base font-semibold text-foreground">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto px-2 pb-3">
                <RecentActivity activities={activities} />
            </CardContent>
        </Card>
    )
}
