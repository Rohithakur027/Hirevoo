"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Mail,
    Plus,
    User,
    Settings,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    Search
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Hirevoo Logo Mark
const HirevooMark = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path
            d="M5 5V19M5 12H13"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
        />
        <path
            d="M13 7L18 12L13 17"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <circle cx="19.5" cy="12" r="1.5" fill="currentColor" />
    </svg>
)

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Mail, label: "Campaigns", href: "/campaigns" },
    { icon: Plus, label: "New Campaign", href: "/campaigns/new" },
    { icon: User, label: "Profile", href: "/profile" },
    { icon: Settings, label: "Settings", href: "/settings" },
]

export function Sidebar() {
    const pathname = usePathname()
    // Default to collapsed as requested "sidebar collapsed"
    const [isCollapsed, setIsCollapsed] = useState(true)

    return (
        <TooltipProvider delayDuration={200}>
            <div
                className={cn(
                    "relative flex flex-col border-r border-border/50 bg-card transition-all duration-300 ease-in-out h-screen",
                    isCollapsed ? "w-16" : "w-64"
                )}
            >
                {/* Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm hover:text-foreground"
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-3 w-3" />
                    ) : (
                        <ChevronLeft className="h-3 w-3" />
                    )}
                </button>

                {/* Logo Section */}
                <div className={cn("flex items-center gap-3 p-4", isCollapsed && "justify-center px-2")}>
                    <Link
                        href="/dashboard"
                        className="flex items-center justify-center rounded-xl bg-violet-600 p-2 shadow-sm transition-all hover:bg-violet-700"
                    >
                        <HirevooMark className="h-5 w-5 text-white" />
                    </Link>
                    {!isCollapsed && (
                        <div className="flex flex-col animate-in fade-in duration-300">
                            <span className="font-bold text-lg tracking-tight">Hirevoo</span>
                        </div>
                    )}
                </div>

                {/* Search - Only when expanded */}
                {!isCollapsed && (
                    <div className="px-4 mb-4 animate-in fade-in duration-300">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="h-9 w-full rounded-lg border border-border bg-muted/50 pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                            />
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-2">
                    <nav className="flex flex-col gap-1 px-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))

                            return (
                                <Tooltip key={item.label} delayDuration={isCollapsed ? 0 : 1000}>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                                isActive
                                                    ? "bg-violet-50 text-violet-700 shadow-sm dark:bg-violet-900/20 dark:text-violet-300"
                                                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                                isCollapsed && "justify-center px-0"
                                            )}
                                        >
                                            <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-violet-600 dark:text-violet-400")} />
                                            {!isCollapsed && (
                                                <span className="animate-in fade-in duration-200">{item.label}</span>
                                            )}
                                            {isActive && !isCollapsed && (
                                                <div className="ml-auto h-2 w-2 rounded-full bg-violet-600" />
                                            )}
                                        </Link>
                                    </TooltipTrigger>
                                    {isCollapsed && (
                                        <TooltipContent side="right" className="font-medium">
                                            {item.label}
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            )
                        })}
                    </nav>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-border/50 p-3">
                    <div className="flex flex-col gap-1">
                        <Tooltip delayDuration={isCollapsed ? 0 : 1000}>
                            <TooltipTrigger asChild>
                                <button
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground",
                                        isCollapsed && "justify-center px-0"
                                    )}
                                >
                                    <HelpCircle className="h-5 w-5 shrink-0" />
                                    {!isCollapsed && <span className="animate-in fade-in">Help & Support</span>}
                                </button>
                            </TooltipTrigger>
                            {isCollapsed && (
                                <TooltipContent side="right">Help & Support</TooltipContent>
                            )}
                        </Tooltip>

                        <div className={cn(
                            "mt-2 flex items-center gap-3 rounded-xl border border-border/50 bg-card p-2 shadow-sm",
                            isCollapsed && "justify-center border-0 p-0 shadow-none"
                        )}>
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 text-sm font-bold text-white shadow-inner">
                                JD
                            </div>
                            {!isCollapsed && (
                                <div className="flex flex-col overflow-hidden animate-in fade-in">
                                    <span className="truncate text-sm font-semibold text-foreground">John Doe</span>
                                    <span className="truncate text-xs text-muted-foreground">Pro Plan</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    )
}
