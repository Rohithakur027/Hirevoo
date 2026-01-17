"use client"

import React, { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"
import Papa from "papaparse"
import { Check, Trash2, CheckCircle, User, FileText, HardDrive, AlertCircle, Upload, X } from "lucide-react"
import { useCampaign } from "@/context/CampaignContext"

export interface Recipient {
  id: string
  email: string
  name?: string
  company?: string
  role?: string
  isValid: boolean
}

// Simulated components (replace with your actual imports)
const Button = ({ children, onClick, disabled, className, variant, size, ...props }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    {...props}
  >
    {children}
  </button>
)

const Input = ({ className, ...props }: any) => (
  <input
    className={`rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${className}`}
    {...props}
  />
)

const Textarea = ({ className, ...props }: any) => (
  <textarea
    className={`rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${className}`}
    {...props}
  />
)

const Card = ({ children, className }: any) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>{children}</div>
)

const CardHeader = ({ children, className }: any) => (
  <div className={`px-4 py-3 border-b border-gray-200 ${className}`}>{children}</div>
)

const CardTitle = ({ children, className }: any) => (
  <h3 className={className}>{children}</h3>
)

const CardContent = ({ children, className }: any) => (
  <div className={`p-4 ${className}`}>{children}</div>
)

interface UploadContactsProps {
  campaignName?: string
  onCampaignNameChange?: (name: string) => void
}

export default function UploadContacts({ campaignName: propCampaignName, onCampaignNameChange }: UploadContactsProps = {}) {
  const router = useRouter()
  const { campaign, addContacts } = useCampaign()
  const [localCampaignName, setLocalCampaignName] = useState("")

  const campaignName = propCampaignName !== undefined ? propCampaignName : localCampaignName
  const setCampaignName = (val: string) => {
    if (onCampaignNameChange) {
      onCampaignNameChange(val)
    } else {
      setLocalCampaignName(val)
    }
  }
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [manualEmail, setManualEmail] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingEmail, setEditingEmail] = useState("")
  const [bulkEmails, setBulkEmails] = useState("")
  const [googleSheetUrl, setGoogleSheetUrl] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [showGoogleSheetsInput, setShowGoogleSheetsInput] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Parse bulk emails
  const parseBulkEmails = (text: string): { emails: string[]; names: string[] } => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    const emails: string[] = []
    const names: string[] = []

    for (const line of lines) {
      const emailMatch = line.match(/([^\s<]+@[^\s>]+)/)
      if (emailMatch) {
        const email = emailMatch[1]
        const nameMatch = line.match(/^([^<]+)</)
        const name = nameMatch ? nameMatch[1].trim() : email.split('@')[0]
        emails.push(email)
        names.push(name)
      }
    }
    return { emails, names }
  }

  // Add single email
  const handleAddEmail = () => {
    if (manualEmail.trim()) {
      const newRecipient: Recipient = {
        id: crypto.randomUUID(),
        email: manualEmail.trim(),
        name: manualEmail.split('@')[0],
        isValid: isValidEmail(manualEmail.trim()),
      }
      setRecipients((prev) => [...prev, newRecipient])
      setManualEmail("")
    }
  }

  // Handle bulk add
  const handleBulkAdd = () => {
    if (bulkEmails.trim()) {
      const { emails, names } = parseBulkEmails(bulkEmails)
      const newRecipients: Recipient[] = emails.map((email, index) => ({
        id: crypto.randomUUID(),
        email,
        name: names[index] || email.split('@')[0],
        isValid: isValidEmail(email),
      }))
      setRecipients((prev) => [...prev, ...newRecipients])
      setBulkEmails("")
      alert(`Added ${newRecipients.length} contacts from bulk input`)
    }
  }

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) handleFileUpload(file)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'text/plain': ['.txt'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false
  })

  // Handle file upload
  const handleFileUpload = (file: File) => {
    setIsUploading(true)
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedContacts: Recipient[] = []
        results.data.forEach((row: any) => {
          const emailKey = Object.keys(row).find(key => key.toLowerCase().includes('email'))
          if (emailKey && row[emailKey]) {
            const email = row[emailKey].toString().trim()
            if (isValidEmail(email)) {
              const nameKey = Object.keys(row).find(key => key.toLowerCase().includes('name'))
              const companyKey = Object.keys(row).find(key => key.toLowerCase().includes('company'))
              const roleKey = Object.keys(row).find(key => key.toLowerCase().includes('role') || key.toLowerCase().includes('title'))

              parsedContacts.push({
                id: crypto.randomUUID(),
                email,
                name: nameKey ? row[nameKey]?.toString().trim() : email.split('@')[0],
                company: companyKey ? row[companyKey]?.toString().trim() : undefined,
                role: roleKey ? row[roleKey]?.toString().trim() : undefined,
                isValid: true,
              })
            }
          }
        })
        setRecipients((prev) => [...prev, ...parsedContacts])
        setIsUploading(false)
        alert(`Successfully uploaded ${parsedContacts.length} contacts`)
      },
      error: () => {
        alert('Failed to parse file. Please check the format.')
        setIsUploading(false)
      }
    })
  }

  // Google Drive integration using Google Picker API
  const handleConnectGoogleDrive = () => {
    alert('Google Drive integration: Please set up OAuth 2.0 credentials to enable this feature. For now, you can use the file upload option.')
  }

  // Import from Google Sheet
  const handleImportSheet = async () => {
    if (!googleSheetUrl.trim()) return

    // Basic URL validation
    if (!googleSheetUrl.includes('docs.google.com/spreadsheets')) {
      alert('Please enter a valid Google Sheets URL')
      return
    }

    alert('Google Sheets import: Make sure the sheet is publicly accessible. This requires Google Sheets API setup.')
  }

  const handleDelete = (id: string) => {
    setRecipients((prev) => prev.filter((r) => r.id !== id))
  }

  const removeDuplicates = () => {
    const seen = new Set()
    const deduplicated = recipients.filter(r => {
      if (seen.has(r.email.toLowerCase())) return false
      seen.add(r.email.toLowerCase())
      return true
    })
    const removed = recipients.length - deduplicated.length
    setRecipients(deduplicated)
    if (removed > 0) alert(`Removed ${removed} duplicate(s)`)
    else alert('No duplicates found')
  }

  const handleEditEmail = (id: string, email: string) => {
    setEditingId(id)
    setEditingEmail(email)
  }

  const handleSaveEdit = (id: string) => {
    if (editingEmail.trim()) {
      setRecipients((prev) =>
        prev.map((r) => r.id === id ? {
          ...r,
          email: editingEmail.trim(),
          name: editingEmail.split('@')[0],
          isValid: isValidEmail(editingEmail.trim())
        } : r)
      )
    }
    setEditingId(null)
    setEditingEmail("")
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingEmail("")
  }

  const validCount = recipients.filter((r) => r.isValid).length

  // Calculate duplicates
  const findDuplicates = () => {
    const emailCounts = recipients.reduce((acc: any, r) => {
      const email = r.email.toLowerCase()
      acc[email] = (acc[email] || 0) + 1
      return acc
    }, {})

    return Object.values(emailCounts).reduce((sum: number, count: any) => {
      return sum + (count > 1 ? count - 1 : 0)
    }, 0)
  }

  const duplicateCount = findDuplicates()

  return (
    <div className="h-screen bg-[#e8eaef] flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="bg-white px-4 py-2 shadow-sm flex items-center justify-between flex-shrink-0">
        <h1 className="text-xs font-semibold text-gray-800">Step 1/3 Upload Contacts</h1>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Campaign Details</span>
          <Input
            value={campaignName}
            onChange={(e: any) => setCampaignName(e.target.value)}
            placeholder={new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            className="h-6 w-32 text-xs"
          />
          <div className="h-6 w-6 flex items-center justify-center rounded-full border border-gray-300 bg-gray-50">
            <User className="h-3 w-3 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout, No Page Scroll */}
      <div className="flex-1 p-3 grid grid-cols-2 gap-3 overflow-hidden min-h-0">

        {/* Left Column - All Input Options Stacked Vertically (No Scroll) */}
        <div className="space-y-3 flex flex-col overflow-y-auto">

          {/* Add Recipients Card */}
          <Card className="flex-shrink-0">
            <CardHeader className="py-2">
              <CardTitle className="text-sm font-semibold text-gray-800">Add Recipients</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 py-2">
              <div className="space-y-1">
                <label className="text-xs text-gray-600 font-medium">Enter Manually</label>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Add Email"
                    value={manualEmail}
                    onChange={(e: any) => setManualEmail(e.target.value)}
                    onKeyPress={(e: any) => e.key === "Enter" && handleAddEmail()}
                    className="h-7 text-xs flex-1"
                  />
                  <Button
                    onClick={handleAddEmail}
                    className="bg-[#7c3aed] text-white px-3 h-7 text-xs hover:bg-[#6d28d9] font-medium"
                  >
                    Add
                  </Button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-600 font-medium">Paste bulk emails</label>
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Paste emails, one per line"
                    value={bulkEmails}
                    onChange={(e: any) => setBulkEmails(e.target.value)}
                    className="h-12 text-xs flex-1 resize-none"
                  />
                  <Button
                    onClick={handleBulkAdd}
                    disabled={!bulkEmails.trim()}
                    className="bg-[#7c3aed] text-white px-3 h-12 text-xs hover:bg-[#6d28d9] font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Add All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload File Card */}
          <Card className="flex-shrink-0">
            <CardHeader className="py-2">
              <CardTitle className="text-sm font-semibold text-gray-800">Upload File</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 border-2 border-[#7c3aed] text-[#7c3aed] bg-white flex items-center justify-center gap-2 h-10 text-xs font-medium hover:bg-purple-50 transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    Browse Computer
                  </Button>
                  <Button
                    onClick={handleConnectGoogleDrive}
                    className="flex-1 border-2 border-[#7c3aed] text-[#7c3aed] bg-white flex items-center justify-center gap-2 h-10 text-xs font-medium hover:bg-purple-50 transition-colors"
                  >
                    <HardDrive className="h-4 w-4" />
                    Google Drive
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-500">Supported: CSV, TXT, XLS, XLSX files</p>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt,.xlsx,.xls"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="hidden"
              />
            </CardContent>
          </Card>

          {/* Google Sheets Import Button */}
          <div className="flex-shrink-0">
            {!showGoogleSheetsInput ? (
              <Button
                onClick={() => setShowGoogleSheetsInput(true)}
                className="w-full border-2 border-[#7c3aed] text-[#7c3aed] bg-white flex items-center justify-center gap-2 h-10 text-sm font-medium hover:bg-purple-50 transition-colors"
              >
                <HardDrive className="h-4 w-4" />
                Import from Google Sheets
              </Button>
            ) : (
              <Card className="border-2 border-[#7c3aed] bg-purple-50">
                <CardContent className="space-y-3 py-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Import from Google Sheets</label>
                    <button
                      onClick={() => setShowGoogleSheetsInput(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <Input
                    type="url"
                    placeholder="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID"
                    value={googleSheetUrl}
                    onChange={(e: any) => setGoogleSheetUrl(e.target.value)}
                    className="h-9 text-sm border-[#7c3aed] focus:ring-[#7c3aed]"
                    autoFocus
                  />
                  <p className="text-xs text-gray-600">Please enter a valid public view URL (ensure link sharing is enabled)</p>
                  <div className="flex justify-between items-center pt-1">
                    <Button
                      onClick={() => setShowGoogleSheetsInput(false)}
                      variant="outline"
                      className="border-gray-300 text-gray-600 h-8 text-xs px-3 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleImportSheet}
                      disabled={!googleSheetUrl.trim()}
                      className="bg-[#7c3aed] text-white hover:bg-[#6d28d9] h-8 text-sm px-4 font-medium disabled:bg-gray-300"
                    >
                      Import Sheet
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Right Column - Recipient List with Isolated Scroll */}
        <Card className="flex flex-col overflow-hidden min-h-0">
          <CardHeader className="py-2 flex-shrink-0 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-gray-800">Recipients ({recipients.length})</CardTitle>
            </div>
            {duplicateCount > 0 && (
              <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg mt-2">
                <AlertCircle className="h-3 w-3 text-amber-600 flex-shrink-0" />
                <span className="text-xs text-amber-800 flex-1">
                  {duplicateCount} duplicate{duplicateCount > 1 ? 's' : ''} found
                </span>
                <Button
                  onClick={removeDuplicates}
                  className="border border-amber-400 bg-white text-amber-700 h-6 text-xs px-2 hover:bg-amber-50 font-medium"
                >
                  Remove
                </Button>
              </div>
            )}
          </CardHeader>

          {/* Scrollable Email List - ISOLATED SCROLL */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {recipients.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-xs">
                No recipients added yet
              </div>
            ) : (
              <div className="space-y-1.5 py-2">
                {recipients.map((recipient) => (
                  <div
                    key={recipient.id}
                    className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-2 hover:bg-gray-50 hover:border-gray-300 transition-all"
                  >
                    {editingId === recipient.id ? (
                      <div className="flex-1 flex gap-2">
                        <Input
                          value={editingEmail}
                          onChange={(e: any) => setEditingEmail(e.target.value)}
                          className="h-6 text-xs flex-1"
                          onKeyPress={(e: any) => {
                            if (e.key === 'Enter') handleSaveEdit(recipient.id)
                            if (e.key === 'Escape') handleCancelEdit()
                          }}
                          autoFocus
                        />
                        <Button
                          onClick={() => handleSaveEdit(recipient.id)}
                          className="bg-[#7c3aed] text-white h-6 px-2 text-xs font-medium"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          className="border border-gray-300 bg-white text-gray-700 h-6 px-2 text-xs hover:bg-gray-50 font-medium"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className={`h-4 w-4 rounded flex items-center justify-center flex-shrink-0 ${recipient.isValid ? "bg-green-500" : "bg-red-500"
                            }`}>
                            <Check className="h-2.5 w-2.5 text-white" />
                          </div>
                          <div className={`text-xs truncate ${recipient.isValid ? "text-gray-800" : "text-red-500"}`}>
                            {recipient.email}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                          <button
                            onClick={() => handleEditEmail(recipient.id, recipient.email)}
                            className="rounded-full p-1 text-blue-500 hover:bg-blue-100 transition-colors"
                            title="Edit"
                          >
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(recipient.id)}
                            className="rounded-full p-1 text-red-500 hover:bg-red-100 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fixed Footer */}
          <div className="border-t border-gray-200 p-3 flex-shrink-0 space-y-2 bg-gray-50">
            <div className="text-xs text-gray-500">
              {recipients.length} contacts added • {validCount} valid
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-800">{validCount} valid emails</span>
              <Button
                className="bg-[#7c3aed] text-white px-4 h-8 text-xs font-medium hover:bg-[#6d28d9] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                disabled={validCount === 0}
                title={validCount === 0 ? "Please add at least 1 email address to proceed" : "Continue to compose emails"}
                onClick={() => {
                  const validContacts = recipients.filter(r => r.isValid)

                  if (validContacts.length > 0) {
                    // Create campaign with valid contacts and navigate to compose step
                    const campaignContacts = validContacts.map(r => ({
                      name: r.name || r.email.split('@')[0],
                      email: r.email,
                      company: r.company,
                      role: r.role
                    }))

                    addContacts(campaignContacts)

                    // Wait for campaign context to update, then navigate
                    setTimeout(() => {
                      const campaignId = campaign?.id || 'current-campaign'
                      router.push(`/campaigns/${campaignId}/compose`)
                    }, 300)
                  }
                }}
              >
                Next Step: Compose Emails
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}