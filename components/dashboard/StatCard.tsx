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
    variant?: "default" | "outline"
}

export function StatCard({
    title,
    value,
    subtitle,
    icon,
    className,
    compact,
    trend,
    trendLabel,
    variant = "default"
}: StatCardProps) {
    const TrendIcon = trend && trend > 0 ? TrendingUp : trend && trend < 0 ? TrendingDown : Minus

    return (
        <Card className={cn(
            "border-border/40 bg-white shadow-sm hover:shadow-md transition-shadow",
            className
        )}>
            <CardContent className={compact ? "p-4" : "p-5"}>
                <div className="flex items-start justify-between">
                    <div className={compact ? "space-y-1" : "space-y-2"}>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            {title}
                        </p>
                        <p className={cn(
                            "font-bold tracking-tight text-foreground",
                            compact ? "text-2xl" : "text-3xl"
                        )}>
                            {value}
                        </p>
                        {subtitle && (
                            <p className="text-xs text-muted-foreground">{subtitle}</p>
                        )}
                        {trend !== undefined && (
                            <div
                                className={cn(
                                    "flex items-center gap-1 text-xs font-medium",
                                    trend > 0 ? "text-emerald-600" : trend < 0 ? "text-red-500" : "text-muted-foreground",
                                )}
                            >
                                {trend === 0 ? (
                                    <span className="text-muted-foreground">—</span>
                                ) : (
                                    <TrendIcon className="h-3.5 w-3.5" />
                                )}
                                <span>
                                    {trend > 0 ? "+" : ""}
                                    {trend}%
                                </span>
                                {trendLabel && (
                                    <span className="text-muted-foreground font-normal">{trendLabel}</span>
                                )}
                            </div>
                        )}
                    </div>
                    <div className={cn(
                        "rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center",
                        compact ? "p-2" : "p-3"
                    )}>
                        {icon}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
