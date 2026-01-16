"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { useCampaign } from "@/context/CampaignContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, ArrowLeft, Mail, MailOpen, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Campaign } from "@/types"

// Mock campaign data with detailed contacts
const mockCampaigns: Campaign[] = [
  {
    id: 'c1',
    name: 'Q1 Outreach - Tech CEOs',
    status: 'sent',
    contacts: [
      {
        id: 'contact-1',
        name: 'Sarah Johnson',
        email: 'sarah@techstartup.com',
        company: 'Tech Startup Inc',
        emailStatus: 'done'
      },
      {
        id: 'contact-2',
        name: 'Mike Chen',
        email: 'mike@innovatetech.com',
        company: 'Innovate Tech',
        emailStatus: 'done'
      },
      {
        id: 'contact-3',
        name: 'Lisa Rodriguez',
        email: 'lisa@futurecorp.com',
        company: 'Future Corp',
        emailStatus: 'draft'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sentAt: new Date().toISOString()
  },
  {
    id: 'c2',
    name: 'Follow-up Sequence A',
    status: 'sent',
    contacts: [
      {
        id: 'contact-4',
        name: 'John Smith',
        email: 'john@startup.io',
        company: 'Startup Inc',
        emailStatus: 'done'
      },
      {
        id: 'contact-5',
        name: 'Emma Davis',
        email: 'emma@techcorp.com',
        company: 'Tech Corp',
        emailStatus: 'pending'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sentAt: new Date().toISOString()
  },
  {
    id: 'c3',
    name: 'Newsletter Signups',
    status: 'sent',
    contacts: [
      {
        id: 'contact-6',
        name: 'Alex Brown',
        email: 'alex@newsletter.com',
        company: 'Newsletter Co',
        emailStatus: 'done'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sentAt: new Date().toISOString()
  }
]

// Campaign Analytics Component
function CampaignAnalytics({ campaign }: { campaign: Campaign }) {
  const sentCount = campaign.contacts?.length || 0
  const openCount = campaign.contacts?.filter(c => c.emailStatus === 'done').length || 0
  const replyCount = Math.floor(openCount * 0.3) // Mock reply rate

  const funnelData = [
    { name: "Sent", value: sentCount, color: "hsl(271, 91%, 65%)" },
    { name: "Opened", value: openCount, color: "hsl(45, 93%, 47%)" },
    { name: "Replied", value: replyCount, color: "hsl(142, 71%, 45%)" },
  ]

  const openRate = Math.round((openCount / sentCount) * 100) || 0
  const replyRate = Math.round((replyCount / sentCount) * 100) || 0

  return (
    <Card className="border-border/50">
      <CardContent className="p-3">
        <div className="flex gap-3">
          {/* Left: Stats in compact vertical layout */}
          <div className="flex gap-2 min-w-[200px]">
            <div className="flex-1 p-2 rounded-lg bg-primary/10 text-center">
              <p className="text-[10px] text-muted-foreground">Sent</p>
              <p className="text-sm font-bold text-foreground">{sentCount.toLocaleString()}</p>
            </div>
            <div className="flex-1 p-2 rounded-lg bg-amber-500/10 text-center">
              <p className="text-[10px] text-muted-foreground">Open Rate</p>
              <p className="text-sm font-bold text-foreground">{openRate}%</p>
            </div>
            <div className="flex-1 p-2 rounded-lg bg-emerald-500/10 text-center">
              <p className="text-[10px] text-muted-foreground">Reply Rate</p>
              <p className="text-sm font-bold text-foreground">{replyRate}%</p>
            </div>
          </div>

          {/* Right: Simple visual representation */}
          <div className="flex-1 flex items-end gap-1">
            {funnelData.map((item, index) => (
              <div key={item.name} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full rounded-t"
                  style={{
                    height: `${Math.max((item.value / sentCount) * 40, 8)}px`,
                    backgroundColor: item.color,
                    minHeight: '8px'
                  }}
                />
                <p className="text-[9px] text-muted-foreground mt-1">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Recipient Table Component
function RecipientTable({ recipients }: { recipients: any[] }) {
  const [showChat, setShowChat] = useState(false)
  const [selectedRecipient, setSelectedRecipient] = useState<any>(null)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "done":
        return <Badge className="bg-emerald-500/15 text-emerald-600 text-[9px] px-1.5 py-0 h-4">Replied</Badge>
      case "draft":
        return <Badge className="bg-amber-500/15 text-amber-600 text-[9px] px-1.5 py-0 h-4">Sent</Badge>
      default:
        return <Badge className="bg-muted text-muted-foreground text-[9px] px-1.5 py-0 h-4">Sent</Badge>
    }
  }

  return (
    <Card className="flex h-full flex-col border-border/50">
      <CardHeader className="flex-shrink-0 pb-1 pt-2 px-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xs font-semibold">Email List</CardTitle>
            <span className="text-[9px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              {recipients.length} contacts
            </span>
          </div>
          <Button size="sm" className="h-6 text-[10px] gap-1">
            <Mail className="h-3 w-3" />
            Quick Follow-up ({recipients.filter(r => r.emailStatus !== 'done').length})
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto px-3 pb-2">
        <table className="w-full">
          <thead className="sticky top-0 bg-card z-10">
            <tr className="border-b border-border">
              <th className="pb-1 text-left text-[9px] font-medium text-muted-foreground">Contact</th>
              <th className="pb-1 text-center text-[9px] font-medium text-muted-foreground">Status</th>
              <th className="pb-1 text-center text-[9px] font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {recipients.map((recipient) => (
              <tr key={recipient.id} className="group hover:bg-muted/30">
                <td className="py-1.5">
                  <p className="text-[10px] font-medium text-foreground truncate max-w-[120px]">{recipient.name}</p>
                  <p className="text-[9px] text-muted-foreground truncate max-w-[120px]">{recipient.email}</p>
                </td>
                <td className="py-1.5 text-center">{getStatusBadge(recipient.emailStatus)}</td>
                <td className="py-1.5">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0"
                      onClick={() => {
                        setSelectedRecipient(recipient)
                        setShowChat(true)
                      }}
                      title="View conversation"
                    >
                      <MessageSquare className="h-3 w-3" />
                    </Button>
                    {recipient.emailStatus !== 'done' && (
                      <Button variant="ghost" size="sm" className="h-5 px-1.5 text-[9px]">
                        <Mail className="mr-0.5 h-2.5 w-2.5" />
                        Follow Up
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {recipients.length === 0 && (
          <div className="py-3 text-center text-[10px] text-muted-foreground">No recipients found.</div>
        )}
      </CardContent>
    </Card>
  )
}

// Main Campaign Page Component
export default function CampaignPage() {
  const params = useParams()
  const router = useRouter()
  const { campaign, setCampaign } = useCampaign()
  const [campaignData, setCampaignData] = useState<Campaign | null>(null)

  useEffect(() => {
    // Priority: context campaign > mock data > default campaign
    if (campaign && (campaign.id === params.campaignId || !params.campaignId)) {
      setCampaignData(campaign)
    } else {
      // Find campaign in mock data (for dashboard campaigns)
      const mockCampaign = mockCampaigns.find(c => c.id === params.campaignId)
      if (mockCampaign) {
        setCampaignData(mockCampaign)
      } else if (campaign) {
        // Use any available campaign from context
        setCampaignData(campaign)
      } else {
        // Create a minimal default campaign
        const defaultCampaign: Campaign = {
          id: params.campaignId as string || 'default-campaign',
          name: 'New Campaign',
          status: 'draft',
          contacts: [
            {
              id: 'contact-1',
              name: 'John Doe',
              email: 'john@example.com',
              company: 'Example Corp',
              emailStatus: 'done'
            }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setCampaignData(defaultCampaign)
      }
    }
  }, [params.campaignId, campaign])

  if (!campaignData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-muted-foreground">Campaign not found</p>
            <Button onClick={() => router.push('/')} className="mt-4">
              Go Home
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const getStatusBadge = (status: Campaign['status']) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-emerald-500/15 text-emerald-600">Sent</Badge>
      case 'sending':
        return <Badge className="bg-amber-500/15 text-amber-600">Sending</Badge>
      case 'ready':
        return <Badge className="bg-blue-500/15 text-blue-600">Ready</Badge>
      default:
        return <Badge className="bg-muted text-muted-foreground">Draft</Badge>
    }
  }

  return (
    <DashboardLayout>
      <div className="h-screen flex flex-col bg-[#e8eaef]">
        {/* Header */}
        <div className="bg-white px-4 py-3 shadow-sm flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
              className="p-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">{campaignData.name}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(campaignData.createdAt).toLocaleDateString()}</span>
                <span>•</span>
                <Users className="h-4 w-4" />
                <span>{campaignData.contacts?.length || 0} contacts</span>
                <span>•</span>
                {getStatusBadge(campaignData.status)}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden">
          {/* Left Column - Analytics */}
          <div className="lg:col-span-1">
            <CampaignAnalytics campaign={campaignData} />
          </div>

          {/* Right Column - Recipients Table */}
          <div className="lg:col-span-2">
            <RecipientTable recipients={campaignData.contacts || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
