"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { ReactNode } from "react"

interface StatCardSparklineProps {
    title: string
    value: string | number
    change: number
    icon: ReactNode
    data: number[]
    color: string
}

export function StatCardSparkline({ title, value, change, icon, data, color }: StatCardSparklineProps) {
    const chartData = data.map((v, i) => ({ value: v, index: i }))
    const isPositive = change >= 0

    return (
        <Card className="border-border/50 bg-card">
            <CardContent className="p-2">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <div className="rounded-md bg-muted/50 p-1.5">{icon}</div>
                        <div>
                            <p className="text-[9px] text-muted-foreground">{title}</p>
                            <p className="text-base font-bold text-foreground">
                                {typeof value === "number" ? value.toLocaleString() : value}
                            </p>
                        </div>
                    </div>
                    <div className="h-8 w-14">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <Line type="monotone" dataKey="value" stroke={color} strokeWidth={1.5} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div
                    className={`mt-0.5 flex items-center gap-1 text-[9px] ${isPositive ? "text-emerald-600" : "text-red-500"}`}
                >
                    {isPositive ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                    <span>
                        {isPositive ? "+" : ""}
                        {change}% last month
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}
