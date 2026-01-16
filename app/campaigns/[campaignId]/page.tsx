"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Mail, MousePointerClick, MessageSquare, Send } from "lucide-react"
import { campaignsList, recipients } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RecipientTable } from "@/components/dashboard/RecipientTable"
import { StatCard } from "@/components/dashboard/StatCard"

export default function CampaignPage() {
  const params = useParams()
  const campaignId = params.campaignId as string
  const campaign = campaignsList.find((c) => c.id === campaignId)

  if (!campaign) {
    return (
      <div className="flex h-full items-center justify-center">
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
  // In a real app, this would be an API call or filtered by campaignId
  const campaignRecipients = recipients

  // Mock stats
  const openRate = 70
  const replyRate = 10
  const sentCount = campaign.sentCount

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/30">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
              <span>/</span>
              <span>{campaign.name}</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">{campaign.name}</h2>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-4 md:grid-cols-4">
          {/* Stats Cards - Row 1 */}
          {/* Stats Cards - Row 1 */}
          <div className="col-span-1">
            <StatCard
              title="Total Outreach"
              value={sentCount.toLocaleString()}
              icon={<Send className="h-3.5 w-3.5" />}
              className="h-full shadow-sm"
              trend={0} // Placeholder or calculate if available
              trendLabel="this campaign"
            />
          </div>

          <div className="col-span-1">
            <StatCard
              title="Total Opened"
              value={`${openRate}%`}
              icon={<MousePointerClick className="h-3.5 w-3.5" />}
              className="h-full shadow-sm"
              trend={0}
              trendLabel="view rate"
            />
          </div>

          <div className="col-span-1">
            <StatCard
              title="Total Replied"
              value={`${replyRate}%`}
              icon={<MessageSquare className="h-3.5 w-3.5" />}
              className="h-full shadow-sm"
              trend={0}
              trendLabel="response rate"
            />
          </div>

          {/* Placeholder for Actions or more stats */}
          <Card className="col-span-1 border-border/50 shadow-sm flex items-center justify-center">
            <CardContent className="p-4 w-full flex flex-col gap-2">
              <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white shadow-sm" size="sm">
                <Send className="mr-2 h-3.5 w-3.5" />
                Campaign Settings
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                Pause Campaign
              </Button>
            </CardContent>
          </Card>

          {/* Email List - Full Width */}
          <div className="col-span-4 mt-2">
            <RecipientTable recipients={campaignRecipients} />
          </div>
        </div>
      </div>
    </div>
  )
}
