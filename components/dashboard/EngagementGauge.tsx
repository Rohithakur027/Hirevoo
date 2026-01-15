"use client"

import { Card, CardContent } from "@/components/ui/card"

interface EngagementGaugeProps {
    rate: number
    target?: number
    compact?: boolean
}

export function EngagementGauge({ rate, target = 75, compact }: EngagementGaugeProps) {
    const radius = 20
    const strokeWidth = 4
    const progressToGoal = Math.min(Math.round((rate / target) * 100), 100)

    return (
        <Card className="border-border/50">
            <CardContent className={compact ? "p-3" : "p-6"}>
                <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 flex-shrink-0">
                        <svg className="h-12 w-12 -rotate-90 transform">
                            <circle
                                cx={24}
                                cy={24}
                                r={radius}
                                stroke="currentColor"
                                strokeWidth={strokeWidth}
                                fill="none"
                                className="text-muted/30"
                            />
                            <circle
                                cx={24}
                                cy={24}
                                r={radius}
                                stroke="currentColor"
                                strokeWidth={strokeWidth}
                                fill="none"
                                strokeLinecap="round"
                                className="text-primary transition-all duration-500"
                                strokeDasharray={2 * Math.PI * radius}
                                strokeDashoffset={2 * Math.PI * radius - (rate / 100) * 2 * Math.PI * radius}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-semibold text-foreground">{rate}%</span>
                        </div>
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Engagement</p>
                        <p className="text-xl font-semibold tracking-tight text-foreground">{rate}%</p>
                        <div className="mt-1 flex items-center gap-1.5">
                            <div className="h-1 flex-1 rounded-full bg-muted/30">
                                <div className="h-1 rounded-full bg-primary transition-all" style={{ width: `${progressToGoal}%` }} />
                            </div>
                            <span className="text-[9px] text-muted-foreground">
                                {progressToGoal}% to {target}%
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
