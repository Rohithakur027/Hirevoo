"use client"

import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/layout/Sidebar"

export function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    // Pages that should NOT have the sidebar
    const isLanding = pathname === "/" || pathname === "/login" || pathname === "/signup"

    // Pages that need full-width (like compose pages)
    const isFullWidth = pathname.includes("/compose") || pathname.includes("/send")

    if (isLanding) {
        return <>{children}</>
    }

    // For compose and send pages, don't show the sidebar
    if (isFullWidth) {
        return <>{children}</>
    }

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-hidden w-full">
                {children}
            </main>
        </div>
    )
}
