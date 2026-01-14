"use client"
import { useState, useCallback } from "react"
import { ContactSidebar } from "./contact-sidebar"
import { EmailEditor } from "./email-editor"
import { NavigationSidebar } from "./navigation-sidebar"
import { BrowseTemplatesModal } from "./browse-templates-modal"
import { AIAssistantModal } from "./ai-assistant-modal"
import { SaveTemplateModal } from "./save-template-modal"
import { MobileContactSheet } from "./mobile-contact-sheet"
import { toast, Toaster } from "sonner"

export type Contact = {
  id: string
  name: string
  email: string
  avatar: string
  avatarColor: string
  status: "ready" | "draft" | "pending"
}

const initialContacts: Contact[] = [
  {
    id: "1",
    name: "Aeley Shon",
    email: "hirevoorca@gmail.com",
    avatar: "AS",
    avatarColor: "bg-indigo-500",
    status: "draft",
  },
  {
    id: "2",
    name: "Robers Report",
    email: "hirevoomt@gmail.com",
    avatar: "RR",
    avatarColor: "bg-rose-400",
    status: "draft",
  },
  {
    id: "3",
    name: "Jimme Horrin",
    email: "hirevoomp@gmail.com",
    avatar: "JH",
    avatarColor: "bg-amber-500",
    status: "draft",
  },
  {
    id: "4",
    name: "Ruolan Smith",
    email: "hirevoomit@gmail.com",
    avatar: "RS",
    avatarColor: "bg-teal-500",
    status: "draft",
  },
  {
    id: "5",
    name: "Haney Mucklan",
    email: "hirevoomn@gmail.com",
    avatar: "HM",
    avatarColor: "bg-slate-500",
    status: "draft",
  },
  {
    id: "6",
    name: "Latern Hangerason",
    email: "hirevoorcc@gmail.com",
    avatar: "LH",
    avatarColor: "bg-emerald-500",
    status: "draft",
  },
]

export type SavedTemplate = {
  id: string
  name: string
  subject: string
  body: string
  createdAt: Date
}

export function ComposeReviewPage() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [selectedContactIndex, setSelectedContactIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")

  const [subject, setSubject] = useState("")
  const [emailBody, setEmailBody] = useState("Hi {FirstName},\n\nI hope this email finds you well...")

  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [isAIModalOpen, setIsAIModalOpen] = useState(false)
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)

  const [useTemplateForAll, setUseTemplateForAll] = useState(false)

  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([])

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const selectedContact = filteredContacts[selectedContactIndex] || filteredContacts[0]
  const isLastContact = selectedContactIndex === filteredContacts.length - 1
  const isFirstContact = selectedContactIndex === 0

  const allReady = contacts.every((c) => c.status === "ready")

  const handleSelectContact = useCallback(
    (contact: Contact) => {
      const index = filteredContacts.findIndex((c) => c.id === contact.id)
      if (index !== -1) {
        setSelectedContactIndex(index)
      }
    },
    [filteredContacts],
  )

  const handleSelectTemplate = (template: { subject: string; body: string }) => {
    setSubject(template.subject)
    setEmailBody(template.body)
  }

  const handleAIInsert = (text: string) => {
    setEmailBody(text)
  }

  const handlePrevious = () => {
    if (selectedContactIndex > 0) {
      setSelectedContactIndex((prev) => prev - 1)
    }
  }

  const handleDoneAndNext = () => {
    setContacts((prev) => prev.map((c) => (c.id === selectedContact.id ? { ...c, status: "ready" as const } : c)))

    const willAllBeReady = contacts.every((c) => c.id === selectedContact.id || c.status === "ready")

    if (isLastContact || willAllBeReady) {
      toast.success("Campaign Submitted!", {
        description: "All emails have been queued for sending.",
      })
    } else {
      setSelectedContactIndex((prev) => prev + 1)
      setEmailBody("Hi {FirstName},\n\nI hope this email finds you well...")
      setSubject("")
      toast.success("Email saved!", {
        description: `Email for ${selectedContact.name} has been marked as ready.`,
      })
    }
  }

  const handleSaveTemplate = (name: string) => {
    const newTemplate: SavedTemplate = {
      id: Date.now().toString(),
      name,
      subject,
      body: emailBody,
      createdAt: new Date(),
    }
    setSavedTemplates((prev) => [...prev, newTemplate])
    toast.success("Template Saved!", {
      description: `"${name}" has been saved to My Saved Templates.`,
    })
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:block">
        <NavigationSidebar />
      </div>

      <MobileContactSheet
        contacts={filteredContacts}
        selectedContact={selectedContact}
        onSelectContact={handleSelectContact}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <ContactSidebar
        contacts={filteredContacts}
        selectedContact={selectedContact}
        onSelectContact={handleSelectContact}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <EmailEditor
        selectedContact={selectedContact}
        subject={subject}
        setSubject={setSubject}
        emailBody={emailBody}
        setEmailBody={setEmailBody}
        useTemplateForAll={useTemplateForAll}
        setUseTemplateForAll={setUseTemplateForAll}
        onOpenTemplates={() => setIsTemplateModalOpen(true)}
        onOpenAI={() => setIsAIModalOpen(true)}
        onOpenSaveTemplate={() => setIsSaveModalOpen(true)}
        onDoneAndNext={handleDoneAndNext}
        onPrevious={handlePrevious}
        isLastContact={isLastContact}
        isFirstContact={isFirstContact}
        allReady={allReady}
        currentIndex={selectedContactIndex}
        totalContacts={filteredContacts.length}
      />

      <BrowseTemplatesModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
        savedTemplates={savedTemplates}
      />

      <AIAssistantModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} onInsertText={handleAIInsert} />

      <SaveTemplateModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveTemplate}
      />

      <Toaster position="bottom-left" richColors />
    </div>
  )
}