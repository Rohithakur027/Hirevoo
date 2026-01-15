import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface StatCardProps {
    title: string
    value: string | number
    subtitle?: string
    icon: React.ReactNode
    className?: string
    compact?: boolean
    trend?: number
    trendLabel?: string
}

export function StatCard({ title, value, subtitle, icon, className, compact, trend, trendLabel }: StatCardProps) {
    const TrendIcon = trend && trend > 0 ? TrendingUp : trend && trend < 0 ? TrendingDown : Minus

    return (
        <Card className={cn("border-border/50", className)}>
            <CardContent className={compact ? "p-3" : "p-6"}>
                <div className="flex items-start justify-between">
                    <div className={compact ? "space-y-0.5" : "space-y-2"}>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
                        <p className={cn("font-semibold tracking-tight text-foreground", compact ? "text-xl" : "text-3xl")}>
                            {value}
                        </p>
                        {subtitle && <p className="text-[10px] text-muted-foreground">{subtitle}</p>}
                        {trend !== undefined && (
                            <div
                                className={cn(
                                    "flex items-center gap-1 text-[10px] font-medium",
                                    trend > 0 ? "text-emerald-600" : trend < 0 ? "text-red-500" : "text-muted-foreground",
                                )}
                            >
                                <TrendIcon className="h-3 w-3" />
                                <span>
                                    {trend > 0 ? "+" : ""}
                                    {trend}%
                                </span>
                                {trendLabel && <span className="text-muted-foreground font-normal">{trendLabel}</span>}
                            </div>
                        )}
                    </div>
                    <div className={cn("rounded-lg bg-primary/10 text-primary", compact ? "p-1.5" : "p-3")}>{icon}</div>
                </div>
            </CardContent>
        </Card>
    )
}
