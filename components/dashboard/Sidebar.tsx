"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    FileText,
    Users,
    User,
    FolderOpen,
    Menu,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Custom Dashboard Icon (colorful bars like in the design)
const DashboardIcon = ({ isActive }: { isActive: boolean }) => (
    <div className="flex items-end gap-0.5 h-5 w-5">
        <div className={cn("w-1.5 h-2 rounded-sm", isActive ? "bg-rose-500" : "bg-rose-400")} />
        <div className={cn("w-1.5 h-3.5 rounded-sm", isActive ? "bg-amber-500" : "bg-amber-400")} />
        <div className={cn("w-1.5 h-2.5 rounded-sm", isActive ? "bg-emerald-500" : "bg-emerald-400")} />
        <div className={cn("w-1.5 h-4 rounded-sm", isActive ? "bg-sky-500" : "bg-sky-400")} />
    </div>
)

// Custom Document Icon (notebook style)
const DocumentIcon = ({ isActive }: { isActive: boolean }) => (
    <div className={cn(
        "h-5 w-5 rounded border-2 flex items-center justify-center",
        isActive ? "border-amber-500 bg-amber-50" : "border-amber-400/70 bg-amber-50/50"
    )}>
        <div className="flex flex-col gap-0.5">
            <div className={cn("w-2 h-0.5 rounded-full", isActive ? "bg-amber-500" : "bg-amber-400")} />
            <div className={cn("w-2 h-0.5 rounded-full", isActive ? "bg-amber-500" : "bg-amber-400")} />
        </div>
    </div>
)

// Custom Team Icon (two people)
const TeamIcon = ({ isActive }: { isActive: boolean }) => (
    <div className="relative h-5 w-5 flex items-center justify-center">
        <div className={cn(
            "absolute left-0.5 h-3 w-3 rounded-full",
            isActive ? "bg-[#4553f4]" : "bg-[#4553f4]/70"
        )} />
        <div className={cn(
            "absolute right-0.5 h-3 w-3 rounded-full",
            isActive ? "bg-[#4553f4]" : "bg-[#4553f4]/70"
        )} />
    </div>
)

// Custom Contact Icon (single person)
const ContactIcon = ({ isActive }: { isActive: boolean }) => (
    <div className="h-5 w-5 flex items-center justify-center">
        <div className={cn(
            "h-4 w-4 rounded-full flex items-center justify-center",
            isActive ? "bg-slate-600" : "bg-slate-500"
        )}>
            <User className="h-2.5 w-2.5 text-white" />
        </div>
    </div>
)

// Custom Folder Icon
const FolderIcon = ({ isActive }: { isActive: boolean }) => (
    <div className="h-5 w-5 flex items-center justify-center">
        <FolderOpen className={cn("h-5 w-5", isActive ? "text-orange-500" : "text-orange-400")} />
    </div>
)

const navItems = [
    { icon: DashboardIcon, label: "Dashboard", href: "/dashboard", iconType: "custom" },
    { icon: DocumentIcon, label: "Campaigns", href: "/campaigns", iconType: "custom" },
    { icon: TeamIcon, label: "Team", href: "/team", iconType: "custom" },
    { icon: ContactIcon, label: "Contacts", href: "/contacts", iconType: "custom" },
    { icon: FolderIcon, label: "Files", href: "/files", iconType: "custom" },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <TooltipProvider delayDuration={100}>
            <div className="flex flex-col w-16 border-r border-border/30 bg-white h-screen">
                {/* Active indicator bar */}
                <div className="absolute left-0 top-0 w-1 h-full bg-transparent">
                    {navItems.map((item, index) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/dashboard' && pathname.startsWith(item.href))
                        return isActive ? (
                            <div
                                key={item.href}
                                className="absolute left-0 w-1 h-10 bg-[#4553f4] rounded-r-full transition-all duration-300"
                                style={{ top: `${64 + index * 56}px` }}
                            />
                        ) : null
                    })}
                </div>

                {/* Navigation Icons */}
                <nav className="flex flex-col items-center pt-16 gap-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/dashboard' && pathname.startsWith(item.href))
                        const IconComponent = item.icon

                        return (
                            <Tooltip key={item.label} delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200",
                                            isActive
                                                ? "bg-slate-100"
                                                : "hover:bg-slate-50"
                                        )}
                                    >
                                        <IconComponent isActive={isActive} />
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="font-medium bg-slate-800 text-white border-0">
                                    {item.label}
                                </TooltipContent>
                            </Tooltip>
                        )
                    })}
                </nav>
            </div>
        </TooltipProvider>
    )
}
