"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Mail, MousePointerClick, MessageSquare } from "lucide-react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface StatCardSparklineProps {
    title: string
    value: string | number
    change: number
    icon: ReactNode
    data: number[]
    color?: string
    accentColor?: "emerald" | "blue"
}

// Mini bar chart component
function MiniBarChart({ data, accentColor = "emerald" }: { data: number[]; accentColor?: "emerald" | "blue" }) {
    const max = Math.max(...data)
    const colorClass = accentColor === "blue" ? "bg-[#4553f4]" : "bg-emerald-500"

    return (
        <div className="flex items-end gap-1 h-10">
            {data.map((value, index) => {
                const height = (value / max) * 100
                return (
                    <div
                        key={index}
                        className={cn("w-2.5 rounded-sm transition-all", colorClass)}
                        style={{ height: `${Math.max(height, 15)}%` }}
                    />
                )
            })}
        </div>
    )
}

export function StatCardSparkline({ title, value, change, icon, data, color, accentColor = "emerald" }: StatCardSparklineProps) {
    const isPositive = change >= 0

    return (
        <Card className="border-border/40 bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                    <div className={cn(
                        "rounded-lg p-2",
                        accentColor === "blue" ? "bg-[#4553f4]/10" : "bg-emerald-50"
                    )}>
                        {icon}
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">{title}</span>
                </div>

                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-3xl font-bold text-foreground tracking-tight">
                            {typeof value === "number" ? value.toLocaleString() : value}
                        </p>
                        <div
                            className={cn(
                                "flex items-center gap-1 text-xs font-medium mt-1",
                                isPositive ? "text-emerald-600" : "text-red-500"
                            )}
                        >
                            {isPositive ? (
                                <TrendingUp className="h-3 w-3" />
                            ) : (
                                <TrendingDown className="h-3 w-3" />
                            )}
                            <span>
                                {isPositive ? "+" : ""}
                                {change}% last month
                            </span>
                        </div>
                    </div>

                    <MiniBarChart data={data} accentColor={accentColor} />
                </div>
            </CardContent>
        </Card>
    )
}
