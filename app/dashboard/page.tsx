"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CampaignTable } from "@/components/dashboard/CampaignTable"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { StatCardSparkline } from "@/components/dashboard/StatCardSparkline"
import { GlobalFollowupDialog } from "@/components/dashboard/GlobalFollowupDialog"
import { globalStats, campaignsList, recentActivity } from "@/lib/data"
import { Mail, MousePointerClick, MessageSquare, Forward, Search, Bell, User } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function DashboardPage() {
  const [showGlobalFollowup, setShowGlobalFollowup] = useState(false)
  const engagementRate = Math.round((globalStats.totalOpens / globalStats.totalSent) * 100)

  // Mock sparkline data
  const outreachData = [320, 380, 420, 390, 450, 480, 520]
  const engagementData = [62, 65, 68, 64, 70, 72, engagementRate]
  const repliesData = [120, 145, 160, 155, 180, 200, 220]

  return (
    <div className="h-screen overflow-hidden bg-muted/30">
      <div className="mx-auto flex h-full max-w-7xl flex-col px-4 py-2">
        <header className="mb-2 flex items-center justify-between gap-4">
          <h1 className="text-base font-semibold text-foreground">Dashboard</h1>

          {/* Stats Cards - Inline with header */}
          <div className="flex items-center gap-2 flex-1 max-w-2xl">
            <StatCardSparkline
              title="Total Outreach"
              value={globalStats.totalSent}
              change={globalStats.weeklyGrowth}
              icon={<Mail className="h-3.5 w-3.5 text-primary" />}
              data={outreachData}
              color="hsl(271, 91%, 65%)"
            />
            <StatCardSparkline
              title="Engagement Rate"
              value={`${engagementRate}%`}
              change={8.2}
              icon={<MousePointerClick className="h-3.5 w-3.5 text-amber-500" />}
              data={engagementData}
              color="hsl(45, 93%, 47%)"
            />
            <StatCardSparkline
              title="Replies"
              value={globalStats.totalReplies}
              change={15.3}
              icon={<MessageSquare className="h-3.5 w-3.5 text-emerald-500" />}
              data={repliesData}
              color="hsl(142, 71%, 45%)"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search..." className="h-7 w-36 pl-7 text-[10px] bg-background" />
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Bell className="h-3.5 w-3.5" />
            </Button>
            <div className="flex items-center gap-1.5">
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-3.5 w-3.5 text-primary" />
              </div>
            </div>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 gap-3 grid-cols-12">
          {/* Campaigns Table - main area */}
          <div className="col-span-8 flex flex-col">
            <CampaignTable campaigns={campaignsList} />
          </div>

          {/* Right sidebar - Follow-up + Recent Activity (bigger) */}
          <div className="col-span-4 flex flex-col gap-2">
            <Button className="w-full h-9" size="sm" onClick={() => setShowGlobalFollowup(true)}>
              <Forward className="mr-2 h-4 w-4" />
              Send Follow-ups ({globalStats.followUpRequired.toLocaleString()})
            </Button>

            {/* Recent Activity - takes most of the space */}
            <div className="flex-1 min-h-0">
              <RecentActivity activities={recentActivity} />
            </div>
          </div>
        </div>
      </div>

      {/* Global Follow-up Dialog */}
      <GlobalFollowupDialog open={showGlobalFollowup} onOpenChange={setShowGlobalFollowup} />
    </div>
  )
}
