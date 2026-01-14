"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SaveTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string) => void
}

export function SaveTemplateModal({ isOpen, onClose, onSave }: SaveTemplateModalProps) {
  const [templateName, setTemplateName] = useState("")

  const handleSave = () => {
    if (templateName.trim()) {
      onSave(templateName.trim())
      setTemplateName("")
      onClose()
    }
  }

  const handleClose = () => {
    setTemplateName("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save as Template</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="template-name">Template Name</Label>
            <Input
              id="template-name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g., Professional Introduction"
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Your template will be saved and available in the &quot;My Saved Templates&quot; tab.
          </p>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!templateName.trim()}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            Save Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}