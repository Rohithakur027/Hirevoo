"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CampaignTable } from "@/components/dashboard/CampaignTable"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { StatCardSparkline } from "@/components/dashboard/StatCardSparkline"
import { EngagementGauge } from "@/components/dashboard/EngagementGauge"
import { DailyChart } from "@/components/dashboard/DailyChart"
import { GlobalFollowupDialog } from "@/components/dashboard/GlobalFollowupDialog"
import { globalStats, campaignsList, recentActivity, dailyData } from "@/lib/data"
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
      <div className="mx-auto flex h-full max-w-[1600px] gap-4 px-4 py-4">
        {/* Main Content Area - Approx 75% width */}
        <div className="flex flex-col flex-1 gap-4 min-w-0 overflow-y-auto pr-2">
          {/* Header */}
          <header className="flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight text-foreground">Dashboard</h1>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search..." className="h-9 w-64 pl-9 bg-background border-border/60" />
              </div>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center border border-border/50">
                <User className="h-4 w-4 text-primary" />
              </div>
            </div>
          </header>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            <StatCardSparkline
              title="Total Outreach"
              value={globalStats.totalSent}
              change={globalStats.weeklyGrowth}
              icon={<Mail className="h-4 w-4 text-primary" />}
              data={outreachData}
              color="hsl(271, 91%, 65%)"
            />
            <StatCardSparkline
              title="Total Opened"
              value={`${engagementRate}%`}
              change={8.2}
              icon={<MousePointerClick className="h-4 w-4 text-amber-500" />}
              data={engagementData}
              color="hsl(45, 93%, 47%)"
            />
            <StatCardSparkline
              title="Total Replied"
              value={globalStats.totalReplies}
              change={15.3}
              icon={<MessageSquare className="h-4 w-4 text-emerald-500" />}
              data={repliesData}
              color="hsl(142, 71%, 45%)"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-3 gap-4 h-[320px]">
            <div className="col-span-1 h-full">
              <EngagementGauge rate={engagementRate} />
            </div>
            <div className="col-span-2 h-full">
              <DailyChart data={dailyData} />
            </div>
          </div>

          {/* Campaigns Table */}
          <div className="flex-1 min-h-[300px]">
            <CampaignTable campaigns={campaignsList} />
          </div>
        </div>

        {/* Right Sidebar - Approx 25% width */}
        <div className="w-[320px] flex-shrink-0 flex flex-col gap-4">
          {/* Mimic the "Schedule" panel style but with Recent Activity content */}
          <div className="flex items-center justify-between px-1">
            <h2 className="font-semibold">Recent Activity</h2>
            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-muted-foreground hover:text-primary">
              See all
            </Button>
          </div>

          <div className="flex-1 overflow-hidden bg-background rounded-xl border border-border/50 shadow-sm flex flex-col">
            <div className="p-4 border-b border-border/50 bg-muted/10">
              {/* Calendar-like header visual to match mock */}
              <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="icon" className="h-6 w-6"><span className="sr-only">Prev</span>←</Button>
                <span className="text-sm font-medium">Activity Feed</span>
                <Button variant="ghost" size="icon" className="h-6 w-6"><span className="sr-only">Next</span>→</Button>
              </div>
              <div className="flex justify-between text-xs text-center text-muted-foreground">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                  <div key={d} className={`flex flex-col gap-1 items-center p-1 rounded-md ${i === 3 ? 'bg-primary text-primary-foreground shadow-sm' : ''}`}>
                    <span>{10 + i}</span>
                    <span className="text-[9px] uppercase">{d}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <RecentActivity activities={recentActivity} />
            </div>
          </div>

          {/* Quick Action (Follow Up) - moved to bottom of sidebar */}
          <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white shadow-sm" onClick={() => setShowGlobalFollowup(true)}>
            <Forward className="mr-2 h-4 w-4" />
            Send Follow-ups
          </Button>
        </div>
      </div>

      {/* Global Follow-up Dialog */}
      <GlobalFollowupDialog open={showGlobalFollowup} onOpenChange={setShowGlobalFollowup} />
    </div>
  )
}
