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
    HelpCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Hirevoo Logo Mark - Same as main sidebar
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

export function NavigationSidebar() {
    const pathname = usePathname()

    return (
        <TooltipProvider delayDuration={200}>
            <div className="w-16 bg-sidebar border-r border-border/50 flex flex-col items-center py-4 gap-2 h-screen">
                {/* Logo */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            href="/dashboard"
                            className="w-10 h-10 bg-gray-900 dark:bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                        >
                            <HirevooMark className="h-5 w-5 text-white dark:text-gray-900" />
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="font-medium">
                        Hirevoo
                    </TooltipContent>
                </Tooltip>

                {/* Nav Items */}
                <nav className="flex flex-col gap-1.5 flex-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                        return (
                            <Tooltip key={item.label}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer",
                                            isActive
                                                ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                                                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                                        )}
                                    >
                                        <item.icon className={cn("w-5 h-5", isActive && "text-primary")} />
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="font-medium">
                                    {item.label}
                                </TooltipContent>
                            </Tooltip>
                        )
                    })}
                </nav>

                {/* Bottom Items */}
                <div className="flex flex-col gap-1.5">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button className="w-10 h-10 rounded-xl flex items-center justify-center text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-all duration-200 cursor-pointer">
                                <HelpCircle className="w-5 h-5" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="font-medium">
                            Help & Support
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white text-sm font-medium shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                J
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="font-medium">
                            John Doe
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </TooltipProvider>
    )
}
