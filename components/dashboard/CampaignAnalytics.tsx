"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import type { Campaign } from "@/lib/data"

interface CampaignAnalyticsProps {
    campaign: Campaign
}

export function CampaignAnalytics({ campaign }: CampaignAnalyticsProps) {
    const { sentCount, openCount, replyCount } = campaign

    const funnelData = [
        { name: "Sent", value: sentCount, color: "hsl(271, 91%, 65%)" },
        { name: "Opened", value: openCount, color: "hsl(45, 93%, 47%)" },
        { name: "Replied", value: replyCount, color: "hsl(142, 71%, 45%)" },
    ]

    const openRate = Math.round((openCount / sentCount) * 100)
    const replyRate = Math.round((replyCount / sentCount) * 100)

    return (
        <Card className="border-border/50">
            <CardContent className="p-2">
                <div className="flex gap-3">
                    {/* Left: Stats in compact vertical layout */}
                    <div className="flex gap-2 min-w-[200px]">
                        <div className="flex-1 p-2 rounded-lg bg-primary/10 text-center">
                            <p className="text-[9px] text-muted-foreground">Sent</p>
                            <p className="text-sm font-bold text-foreground">{sentCount.toLocaleString()}</p>
                        </div>
                        <div className="flex-1 p-2 rounded-lg bg-amber-500/10 text-center">
                            <p className="text-[9px] text-muted-foreground">Open Rate</p>
                            <p className="text-sm font-bold text-foreground">{openRate}%</p>
                        </div>
                        <div className="flex-1 p-2 rounded-lg bg-emerald-500/10 text-center">
                            <p className="text-[9px] text-muted-foreground">Reply Rate</p>
                            <p className="text-sm font-bold text-foreground">{replyRate}%</p>
                        </div>
                    </div>

                    {/* Right: Vertical Bar Chart */}
                    <div className="flex-1 h-[60px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={funnelData} margin={{ top: 0, right: 5, left: 5, bottom: 0 }}>
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{
                                        fontSize: 10,
                                        padding: "4px 8px",
                                        background: "hsl(var(--card))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: 6,
                                    }}
                                    formatter={(value: number) => [value.toLocaleString(), ""]}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={24}>
                                    {funnelData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
