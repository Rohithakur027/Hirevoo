"use client"

import { useState } from "react"
import { Sparkles, X, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface AIAssistantModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerateEmail?: (prompt: string, tone: string) => void
  onCopyToEditor?: (text: string) => void
  isLoading?: boolean
}

export function AIAssistantModal({
  isOpen,
  onClose,
  onGenerateEmail,
  onCopyToEditor,
  isLoading,
}: AIAssistantModalProps) {
  const [prompt, setPrompt] = useState("")
  const [tone, setTone] = useState("professional")
  const [generatedText, setGeneratedText] = useState("")

  const handleGenerate = async () => {
    if (prompt.trim()) {
      onGenerateEmail?.(prompt, tone)
      const simulated = `Dear Valued Contact,\n\n${prompt}\n\nBest regards`
      setGeneratedText(simulated)
      setPrompt("")
    }
  }

  const handleCopy = () => {
    if (generatedText) {
      onCopyToEditor?.(generatedText)
      handleClose()
    }
  }

  const handleClose = () => {
    setPrompt("")
    setGeneratedText("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={handleClose} />

      <div className="fixed inset-0 sm:top-1/2 sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md z-50 p-3 sm:p-0">
        <div className="bg-white dark:bg-slate-950 rounded-lg shadow-xl border border-border h-full sm:h-auto flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-blue-500" />
              <span className="text-sm sm:text-base font-semibold text-foreground">AI Assist</span>
            </div>
            <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
              <X className="w-4 sm:w-5 h-4 sm:h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5">
            <div className="flex justify-center py-2 sm:py-4">
              <div
                className="w-24 sm:w-32 h-24 sm:h-32 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.4), rgba(139, 92, 246, 0.2), rgba(255, 255, 255, 0))",
                  backdropFilter: "blur(10px)",
                }}
              />
            </div>

            {/* Question text */}
            <div className="text-center">
              <p className="text-xs sm:text-sm text-muted-foreground">What do you want to know about this email?</p>
            </div>

            {/* Tone selector */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs rounded border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="casual">Casual</option>
                <option value="formal">Formal</option>
              </select>
            </div>

            {/* Prompt input */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">What do you want to say?</label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Write an email introducing myself as a software developer..."
                className="min-h-16 sm:min-h-20 text-xs sm:text-sm resize-none p-2"
              />
            </div>

            {/* Generate button */}
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isLoading}
              className="w-full h-8 sm:h-10 text-xs sm:text-sm gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              {isLoading ? "Generating..." : "Generate"}
            </Button>

            {/* Generated text preview */}
            {generatedText && (
              <div className="space-y-3 p-3 sm:p-4 bg-muted/30 rounded-lg border border-border/50">
                <p className="text-xs font-medium text-foreground">Generated:</p>
                <p className="text-xs sm:text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto">
                  {generatedText}
                </p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleCopy}
                        size="sm"
                        variant="ghost"
                        className="w-full h-8 sm:h-9 text-xs gap-2 hover:bg-primary/10"
                      >
                        <Copy className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
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
      </div>
    </>
  )
}