"use client"

import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/dashboard/Sidebar"

export function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    // Pages that should NOT have the sidebar
    // Adjust this list as needed. Typically root '/' is landing.
    const isLanding = pathname === "/" || pathname === "/login" || pathname === "/signup"

    if (isLanding) {
        return <>{children}</>
    }

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-auto w-full">
                {children}
            </main>
        </div>
    )
}
