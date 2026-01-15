"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { formatChartDate } from "@/lib/date-helpers"
import type { DailyData } from "@/lib/data"

interface DailyChartProps {
    data: DailyData[]
    compact?: boolean
}

export function DailyChart({ data, compact }: DailyChartProps) {
    return (
        <Card className="flex h-full flex-col border-border/50">
            <CardHeader className="flex-shrink-0 pb-0 pt-2 px-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-semibold">Daily Activity</CardTitle>
                    <div className="flex items-center gap-2 text-[9px]">
                        <div className="flex items-center gap-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            <span className="text-muted-foreground">Sends</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                            <span className="text-muted-foreground">Opens</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            <span className="text-muted-foreground">Replies</span>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 px-2 pb-2 pt-1">
                <div className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorSends" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(271, 91%, 65%)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(271, 91%, 65%)" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorOpens" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(271, 70%, 75%)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(271, 70%, 75%)" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorReplies" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={formatChartDate}
                                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 8 }}
                                tickLine={false}
                                axisLine={false}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 8 }}
                                tickLine={false}
                                axisLine={false}
                                width={20}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "6px",
                                    fontSize: "10px",
                                    padding: "4px 8px",
                                }}
                                labelFormatter={formatChartDate}
                            />
                            <Area
                                type="monotone"
                                dataKey="sends"
                                stroke="hsl(271, 91%, 65%)"
                                strokeWidth={1.5}
                                fillOpacity={1}
                                fill="url(#colorSends)"
                            />
                            <Area
                                type="monotone"
                                dataKey="opens"
                                stroke="hsl(271, 70%, 75%)"
                                strokeWidth={1.5}
                                fillOpacity={1}
                                fill="url(#colorOpens)"
                            />
                            <Area
                                type="monotone"
                                dataKey="replies"
                                stroke="hsl(142, 71%, 45%)"
                                strokeWidth={1.5}
                                fillOpacity={1}
                                fill="url(#colorReplies)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
