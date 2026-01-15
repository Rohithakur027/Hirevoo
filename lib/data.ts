export type RecipientStatus = "Sent" | "Opened" | "Replied"

export interface Recipient {
    id: string
    name: string
    email: string
    status: RecipientStatus
    sentAt: string
}

export interface Message {
    id: string
    from: "user" | "recipient"
    content: string
    timestamp: string
}

export interface Campaign {
    id: string
    name: string
    sentCount: number
    openCount: number
    replyCount: number
    status: "active" | "completed" | "draft"
}

export interface DailyData {
    date: string
    sends: number
    opens: number
    replies: number
}

export interface RecentActivity {
    id: string
    type: "sent" | "open" | "reply"
    contact: string
    time: string
    isHighIntent?: boolean
    message?: string
}

export const recipients: Recipient[] = [
    {
        id: "1",
        name: "Alice Cooper",
        email: "alice@example.com",
        status: "Sent",
        sentAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
        id: "2",
        name: "Bob Smith",
        email: "bob@company.com",
        status: "Opened",
        sentAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
    },
    {
        id: "3",
        name: "Charlie Brown",
        email: "charlie@startup.io",
        status: "Replied",
        sentAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
    {
        id: "4",
        name: "David Lee",
        email: "david@tech.net",
        status: "Sent",
        sentAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
        id: "5",
        name: "Eva Green",
        email: "eva@design.org",
        status: "Opened",
        sentAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    },
]

export const campaignsList: Campaign[] = [
    {
        id: "c1",
        name: "Q1 Outreach - Tech CEOs",
        sentCount: 1250,
        openCount: 850,
        replyCount: 120,
        status: "active",
    },
    {
        id: "c2",
        name: "Follow-up Sequence A",
        sentCount: 450,
        openCount: 380,
        replyCount: 95,
        status: "active",
    },
    {
        id: "c3",
        name: "Newsletter Signups",
        sentCount: 2100,
        openCount: 1900,
        replyCount: 50,
        status: "completed",
    },
]

export const globalStats = {
    totalSent: 15420,
    totalOpens: 9850,
    totalReplies: 2340,
    weeklyGrowth: 12.5,
    followUpRequired: 145,
}

export const recentActivity: RecentActivity[] = [
    {
        id: "a1",
        type: "reply",
        contact: "Sarah Miller",
        time: "2 mins ago",
        isHighIntent: true,
        message: "This sounds interesting, let's chat next week.",
    },
    {
        id: "a2",
        type: "open",
        contact: "Mike Johnson",
        time: "15 mins ago",
    },
    {
        id: "a3",
        type: "sent",
        contact: "Alex Wilson",
        time: "1 hour ago",
    },
    {
        id: "a4",
        type: "reply",
        contact: "Emily Chen",
        time: "2 hours ago",
        message: "Not interested right now, thanks.",
    },
    {
        id: "a5",
        type: "open",
        contact: "David Kim",
        time: "3 hours ago",
        isHighIntent: true,
    },
]

export const dailyData: DailyData[] = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return {
        date: d.toISOString(),
        sends: Math.floor(Math.random() * 50) + 100,
        opens: Math.floor(Math.random() * 30) + 50,
        replies: Math.floor(Math.random() * 10) + 5,
    }
})

export function getEmailConversation(recipientId: string): Message[] {
    // Mock conversation
    return [
        {
            id: "m1",
            from: "user",
            content: "Hi there, I noticed you were hiring...",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        },
        {
            id: "m2",
            from: "recipient",
            content: "Thanks for reaching out! Can you send more info?",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
        },
        {
            id: "m3",
            from: "user",
            content: "Absolutely! Here is our portfolio...",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        },
    ]
}
