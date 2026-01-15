"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Settings2 } from "lucide-react"
import type { Campaign } from "@/lib/data"

interface CampaignTableProps {
    campaigns: Campaign[]
}

export function CampaignTable({ campaigns }: CampaignTableProps) {
    const [search, setSearch] = useState("")

    const filteredCampaigns = campaigns.filter((campaign) => campaign.name.toLowerCase().includes(search.toLowerCase()))

    return (
        <Card className="flex h-full flex-col border-border/50">
            <CardHeader className="flex-shrink-0 pb-1 pt-2 px-3">
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-xs font-semibold">Campaigns</CardTitle>
                    <div className="relative w-36">
                        <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-6 pl-7 text-[10px]"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto px-3 pb-2">
                <table className="w-full">
                    <thead className="sticky top-0 bg-card">
                        <tr className="border-b border-border">
                            <th className="pb-1 text-left text-[10px] font-medium text-muted-foreground">Campaign</th>
                            <th className="pb-1 text-center text-[10px] font-medium text-muted-foreground">CTR</th>
                            <th className="pb-1 text-right text-[10px] font-medium text-muted-foreground">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {filteredCampaigns.map((campaign) => {
                            const ctr = Math.round((campaign.replyCount / campaign.sentCount) * 100)

                            return (
                                <tr key={campaign.id} className="group">
                                    <td className="py-1.5">
                                        <p className="text-[11px] font-medium text-foreground truncate max-w-[200px]">{campaign.name}</p>
                                        <p className="text-[9px] text-muted-foreground">{campaign.sentCount.toLocaleString()} sent</p>
                                    </td>
                                    <td className="py-1.5 text-center">
                                        <span
                                            className={`inline-flex items-center rounded-full px-1.5 py-0 text-[10px] font-medium ${ctr >= 10
                                                    ? "bg-emerald-500/15 text-emerald-600"
                                                    : ctr >= 5
                                                        ? "bg-amber-500/15 text-amber-600"
                                                        : "bg-muted text-muted-foreground"
                                                }`}
                                        >
                                            {ctr}%
                                        </span>
                                    </td>
                                    <td className="py-1.5 text-right">
                                        <Button variant="ghost" size="sm" className="h-5 px-1.5 text-[10px]" asChild>
                                            <Link href={`/campaigns/${campaign.id}`}>
                                                <Settings2 className="mr-1 h-3 w-3" />
                                                Manage
                                            </Link>
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {filteredCampaigns.length === 0 && (
                    <div className="py-4 text-center text-[10px] text-muted-foreground">No campaigns found.</div>
                )}
            </CardContent>
        </Card>
    )
}
