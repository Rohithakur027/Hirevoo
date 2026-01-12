"use client"

import { useState } from "react"
import { Sparkles, X, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface AIAssistantBoxProps {
  onGenerateEmail?: (prompt: string, tone: string) => void
  onCopyToEditor?: (text: string) => void
  isLoading?: boolean
}

export function AIAssistantBox({ onGenerateEmail, onCopyToEditor, isLoading }: AIAssistantBoxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [tone, setTone] = useState("professional")
  const [generatedText, setGeneratedText] = useState("")

  const handleGenerate = async () => {
    if (prompt.trim()) {
      onGenerateEmail?.(prompt, tone)
      // Simulated response
      const simulated = `Dear Valued Contact,\n\n${prompt}\n\nBest regards`
      setGeneratedText(simulated)
      setPrompt("")
    }
  }

  const handleCopy = () => {
    if (generatedText) {
      onCopyToEditor?.(generatedText)
    }
  }

  if (!isOpen) {
    return (
      <div className="border border-border rounded-lg bg-background">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">AI Assist</span>
          </div>
        </button>
      </div>
    )
  }

  return (
    <div className="border border-border rounded-lg bg-white dark:bg-slate-950 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium">AI Assist</span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="text-xs">
              Close AI Assistant
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Content */}
      <div className="px-4 py-3 space-y-3 max-h-96 overflow-y-auto">
        {/* Blue gradient circle - visual element */}
        <div className="flex justify-center py-2">
          <div
            className="w-24 h-24 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.4), rgba(139, 92, 246, 0.2), rgba(255, 255, 255, 0))",
              backdropFilter: "blur(10px)",
            }}
          />
        </div>

        {/* Tone selector */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground">Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full px-2 py-1.5 text-xs rounded border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
          </select>
        </div>

        {/* Prompt input */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground">What do you want to say?</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Write an email introducing myself as a software developer..."
            className="min-h-12 text-xs resize-none"
          />
        </div>

        {/* Generate button */}
        <Button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isLoading}
          size="sm"
          className="w-full h-8 text-xs gap-1"
        >
          <Sparkles className="w-3 h-3" />
          {isLoading ? "Generating..." : "Generate"}
        </Button>

        {/* Generated text preview */}
        {generatedText && (
          <div className="space-y-2 p-2 bg-muted/30 rounded border border-border/50">
            <p className="text-xs font-medium text-foreground">Generated:</p>
            <p className="text-xs text-foreground/80 whitespace-pre-wrap leading-relaxed">{generatedText}</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleCopy} size="sm" variant="ghost" className="w-full h-7 text-xs gap-1">
                    <Copy className="w-3 h-3" />
                    Copy to Email
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-xs">Copy this text to the email editor</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  )
}