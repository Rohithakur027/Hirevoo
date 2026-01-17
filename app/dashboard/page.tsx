"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CampaignTable } from "@/components/dashboard/CampaignTable"
import { RecentActivity, RecentActivityCard } from "@/components/dashboard/RecentActivity"
import { StatCardSparkline } from "@/components/dashboard/StatCardSparkline"
import { GlobalFollowupDialog } from "@/components/dashboard/GlobalFollowupDialog"
import { globalStats, campaignsList, recentActivity } from "@/lib/data"
import { Mail, TrendingUp, MessageSquare, Search, Bell, Mail as MailIcon, Menu, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function DashboardPage() {
    const [showGlobalFollowup, setShowGlobalFollowup] = useState(false)
    const engagementRate = Math.round((globalStats.totalOpens / globalStats.totalSent) * 100)

    // Mock sparkline data (8 bars like in the design)
    const outreachData = [60, 80, 70, 90, 75, 85, 95, 100]
    const engagementData = [50, 70, 60, 80, 65, 75, 85, 90]
    const repliesData = [40, 60, 50, 70, 55, 65, 80, 95]

    return (
        <div className="h-screen overflow-hidden bg-slate-50">
            <div className="flex h-full">
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    {/* Header */}
                    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-600 hover:bg-slate-100">
                                <Menu className="h-5 w-5" />
                            </Button>
                            <h1 className="text-xl font-bold tracking-tight text-foreground">Dashboard</h1>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search"
                                    className="h-10 w-64 pl-10 bg-slate-50 border-slate-200 rounded-lg focus:bg-white"
                                />
                            </div>

                            {/* Notification Bell */}
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-slate-100 relative">
                                <Bell className="h-5 w-5 text-slate-600" />
                                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500" />
                            </Button>

                            {/* Mail Icon */}
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-slate-100 relative">
                                <MailIcon className="h-5 w-5 text-slate-600" />
                                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500" />
                            </Button>

                            {/* User Profile */}
                            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white font-semibold text-sm">
                                    LY
                                </div>
                                <div className="hidden md:flex flex-col">
                                    <span className="text-sm font-medium text-foreground">Lamine Yamal</span>
                                    <span className="text-xs text-muted-foreground">HR Manager</span>
                                </div>
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>
                    </header>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-5 mb-6">
                            <StatCardSparkline
                                title="Total Outreach"
                                value={globalStats.totalSent.toLocaleString().replace(/,/g, ',')}
                                change={18.3}
                                icon={<Mail className="h-5 w-5 text-emerald-600" />}
                                data={outreachData}
                                accentColor="emerald"
                            />
                            <StatCardSparkline
                                title="Total Opened"
                                value={`${engagementRate}%`}
                                change={13.7}
                                icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
                                data={engagementData}
                                accentColor="emerald"
                            />
                            <StatCardSparkline
                                title="Total Replied"
                                value={globalStats.totalReplies.toLocaleString().replace(/,/g, ',')}
                                change={13.7}
                                icon={<MessageSquare className="h-5 w-5 text-emerald-600" />}
                                data={repliesData}
                                accentColor="emerald"
                            />
                        </div>

                        {/* Campaigns Table */}
                        <div className="h-[calc(100%-180px)]">
                            <CampaignTable campaigns={campaignsList} />
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Recent Activity */}
                <div className="w-[340px] flex-shrink-0 border-l border-slate-200 bg-white overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-slate-100">
                        <h2 className="text-base font-semibold text-foreground">Recent Activity</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto px-2 py-2">
                        <RecentActivity activities={recentActivity} />
                    </div>
                </div>
            </div>

            {/* Global Follow-up Dialog */}
            <GlobalFollowupDialog open={showGlobalFollowup} onOpenChange={setShowGlobalFollowup} />
        </div>
    )
}
