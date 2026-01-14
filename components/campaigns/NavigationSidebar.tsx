"use client"

import { Mail, Users, Send, Tag, Settings, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const navItems = [
  { icon: Mail, label: "Inbox", active: true },
  { icon: Users, label: "Contacts", active: false },
  { icon: Send, label: "Sent", active: false },
  { icon: Tag, label: "Tags", active: false },
  { icon: Settings, label: "Settings", active: false },
]

export function NavigationSidebar() {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="w-16 bg-slate-50 border-r flex flex-col items-center py-4 gap-2">
        {/* Logo */}
        <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-violet-700 rounded-xl flex items-center justify-center mb-4 shadow-sm">
          <span className="text-white font-bold text-lg">H</span>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-1.5 flex-1">
          {navItems.map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <button
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
                    item.active
                      ? "bg-violet-100 text-violet-700 shadow-sm"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
                  )}
                >
                  <item.icon className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                {item.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>

        {/* Bottom Items */}
        <div className="flex flex-col gap-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all duration-200">
                <HelpCircle className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              Help & Support
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium shadow-sm hover:shadow-md transition-shadow">
                J
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              John Doe
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}