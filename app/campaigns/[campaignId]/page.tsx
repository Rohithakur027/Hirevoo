"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Send, Eye, MessageSquare, Mail, Search, Bell, Mail as MailIcon, Menu, ChevronDown } from "lucide-react"
import { campaignsList, recipients } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RecipientTable } from "@/components/dashboard/RecipientTable"
import { StatCard } from "@/components/dashboard/StatCard"

export default function CampaignPage() {
    const params = useParams()
    const campaignId = params.campaignId as string
    const campaign = campaignsList.find((c) => c.id === campaignId)

    if (!campaign) {
        return (
            <div className="flex h-full items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h2 className="text-lg font-semibold">Campaign not found</h2>
                    <Button variant="link" asChild className="mt-2">
                        <Link href="/dashboard">Return to Dashboard</Link>
                    </Button>
                </div>
            </div>
        )
    }

    // Filter recipients for this campaign (mock filter)
    const campaignRecipients = recipients

    // Mock stats
    const openRate = 70
    const replyRate = 10
    const sentCount = campaign.sentCount

    return (
        <div className="h-screen overflow-hidden bg-slate-50">
            <div className="flex flex-col h-full">
                {/* Header */}
                <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-600 hover:bg-slate-100">
                            <Menu className="h-5 w-5" />
                        </Button>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-600 hover:bg-slate-100"
                                asChild
                            >
                                <Link href="/dashboard">
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Link href="/dashboard" className="hover:text-foreground transition-colors">
                                        Dashboard
                                    </Link>
                                    <span>/</span>
                                    <span>{campaign.name}</span>
                                </div>
                                <h1 className="text-xl font-bold tracking-tight text-foreground">
                                    {campaign.name}
                                </h1>
                            </div>
                        </div>
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

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Stats Row and Actions */}
                    <div className="grid grid-cols-4 gap-5 mb-6">
                        {/* Stat Cards */}
                        <StatCard
                            title="Total Outreach"
                            value={sentCount.toLocaleString()}
                            icon={<Send className="h-5 w-5" />}
                            trend={0}
                            trendLabel="this campaign"
                        />

                        <StatCard
                            title="Total Opened"
                            value={`${openRate}%`}
                            icon={<Eye className="h-5 w-5" />}
                            trend={0}
                            trendLabel="view rate"
                        />

                        <StatCard
                            title="Total Replied"
                            value={`${replyRate}%`}
                            icon={<MessageSquare className="h-5 w-5" />}
                            trend={0}
                            trendLabel="response rate"
                        />

                        {/* Action Buttons Card */}
                        <Card className="border-border/40 bg-white shadow-sm">
                            <CardContent className="p-5 flex flex-col justify-center h-full gap-3">
                                <Button
                                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm font-medium"
                                    asChild
                                >
                                    <Link href={`/campaigns/${campaignId}/compose`}>
                                        <Mail className="mr-2 h-4 w-4" />
                                        Compose Emails
                                    </Link>
                                </Button>
                                <Button variant="outline" className="w-full border-slate-300 hover:bg-slate-50">
                                    Campaign Settings
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Email List Table */}
                    <div className="h-[calc(100%-180px)]">
                        <RecipientTable recipients={campaignRecipients} />
                    </div>
                </div>
            </div>
        </div>
    )
}
