"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Eye, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Campaign } from "@/lib/data"

interface CampaignTableProps {
    campaigns: Campaign[]
}

// Avatar colors for campaigns (rotating)
const avatarColors = [
    "bg-emerald-500",
    "bg-[#4553f4]",
    "bg-amber-500",
    "bg-rose-500",
    "bg-teal-500",
    "bg-purple-500",
]

function getInitials(name: string): string {
    return name
        .split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 1)
}

function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { day: "numeric", month: "short" })
}

export function CampaignTable({ campaigns }: CampaignTableProps) {
    const [search, setSearch] = useState("")

    const filteredCampaigns = campaigns.filter((campaign) =>
        campaign.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <Card className="flex h-full flex-col border-border/40 bg-white shadow-sm">
            <CardHeader className="flex-shrink-0 pb-4 pt-5 px-5">
                <div className="flex items-center justify-between gap-4">
                    <CardTitle className="text-lg font-semibold text-foreground">Campaigns</CardTitle>
                    <div className="relative w-48">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search campaigns..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-9 pl-9 text-sm bg-slate-50 border-slate-200 focus:bg-white"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto px-5 pb-4">
                <div className="space-y-2">
                    {filteredCampaigns.map((campaign, index) => {
                        const avatarColor = avatarColors[index % avatarColors.length]
                        const initial = getInitials(campaign.name)
                        const replyCount = campaign.replyCount

                        return (
                            <div
                                key={campaign.id}
                                className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-slate-50 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    {/* Avatar */}
                                    <div className={cn(
                                        "flex h-10 w-10 items-center justify-center rounded-full text-white font-semibold text-sm",
                                        avatarColor
                                    )}>
                                        {initial}
                                    </div>

                                    {/* Campaign Info */}
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-foreground text-sm">
                                                {campaign.name}
                                            </span>
                                            {replyCount > 0 && (
                                                <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-emerald-500 text-white text-xs font-medium">
                                                    {replyCount}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            <span>{formatDate(campaign.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* View Button */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-3 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-medium"
                                    asChild
                                >
                                    <Link href={`/campaigns/${campaign.id}`}>
                                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                                        View
                                    </Link>
                                </Button>
                            </div>
                        )
                    })}
                </div>
                {filteredCampaigns.length === 0 && (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                        No campaigns found.
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
