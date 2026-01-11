'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileSpreadsheet, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { CampaignContact } from '@/types';

interface ContactUploaderProps {
  onContactsUploaded: (contacts: Omit<CampaignContact, 'id' | 'emailStatus'>[]) => void;
  uploadedContacts?: Omit<CampaignContact, 'id' | 'emailStatus'>[];
}

interface ParseError {
  row: number;
  message: string;
}

export function ContactUploader({ onContactsUploaded, uploadedContacts = [] }: ContactUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [contacts, setContacts] = useState<Omit<CampaignContact, 'id' | 'emailStatus'>[]>(uploadedContacts);
  const [errors, setErrors] = useState<ParseError[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const parseCSV = useCallback((text: string): { contacts: Omit<CampaignContact, 'id' | 'emailStatus'>[]; errors: ParseError[] } => {
    const lines = text.trim().split('\n');
    const parsedContacts: Omit<CampaignContact, 'id' | 'emailStatus'>[] = [];
    const parseErrors: ParseError[] = [];

    if (lines.length < 2) {
      parseErrors.push({ row: 0, message: 'CSV file must have a header row and at least one data row' });
      return { contacts: [], errors: parseErrors };
    }

    // Parse header
    const header = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/"/g, ''));
    const nameIndex = header.findIndex(h => h === 'name' || h === 'full name' || h === 'fullname');
    const emailIndex = header.findIndex(h => h === 'email' || h === 'email address');
    const companyIndex = header.findIndex(h => h === 'company' || h === 'company name' || h === 'organization');
    const roleIndex = header.findIndex(h => h === 'role' || h === 'title' || h === 'job title' || h === 'position');

    if (emailIndex === -1) {
      parseErrors.push({ row: 1, message: 'CSV must have an "email" column' });
      return { contacts: [], errors: parseErrors };
    }

    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Handle quoted values with commas
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (const char of line) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      const email = values[emailIndex]?.replace(/"/g, '').trim();
      const name = nameIndex >= 0 ? values[nameIndex]?.replace(/"/g, '').trim() : email?.split('@')[0] || '';
      const company = companyIndex >= 0 ? values[companyIndex]?.replace(/"/g, '').trim() : undefined;
      const role = roleIndex >= 0 ? values[roleIndex]?.replace(/"/g, '').trim() : undefined;

      if (!email) {
        parseErrors.push({ row: i + 1, message: 'Missing email address' });
        continue;
      }

      if (!validateEmail(email)) {
        parseErrors.push({ row: i + 1, message: `Invalid email format: ${email}` });
        continue;
      }

      parsedContacts.push({ name, email, company, role });
    }

    return { contacts: parsedContacts, errors: parseErrors };
  }, []);

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith('.csv')) {
      setErrors([{ row: 0, message: 'Please upload a CSV file' }]);
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const { contacts: parsedContacts, errors: parseErrors } = parseCSV(text);
      
      setContacts(parsedContacts);
      setErrors(parseErrors);
      
      if (parsedContacts.length > 0) {
        onContactsUploaded(parsedContacts);
      }
    };

    reader.readAsText(file);
  }, [parseCSV, onContactsUploaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const clearUpload = () => {
    setContacts([]);
    setErrors([]);
    setFileName(null);
    onContactsUploaded([]);
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer',
          isDragging
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50',
          contacts.length > 0 && 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10'
        )}
        whileHover={{ scale: 1.01 }}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {contacts.length > 0 ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                {contacts.length} contacts loaded
              </p>
              <p className="text-sm text-muted-foreground">{fileName}</p>
            </div>
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); clearUpload(); }}>
              <X className="w-4 h-4 mr-2" />
              Clear & Upload New
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Upload className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold">Drop your CSV file here</p>
              <p className="text-sm text-muted-foreground">or click to browse</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Supported: CSV with columns: name, email, company (optional), role (optional)</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Errors */}
      {errors.length > 0 && (
        <Card className="p-4 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-300">
                {errors.length} issue{errors.length > 1 ? 's' : ''} found
              </p>
              <ul className="mt-2 space-y-1">
                {errors.slice(0, 5).map((err, i) => (
                  <li key={i} className="text-sm text-amber-700 dark:text-amber-400">
                    Row {err.row}: {err.message}
                  </li>
                ))}
                {errors.length > 5 && (
                  <li className="text-sm text-amber-700 dark:text-amber-400">
                    ...and {errors.length - 5} more
                  </li>
                )}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Preview Table */}
      {contacts.length > 0 && (
        <Card>
          <div className="p-4 border-b">
            <h3 className="font-semibold">Preview (first 5 contacts)</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.slice(0, 5).map((contact, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.company || '-'}</TableCell>
                  <TableCell>{contact.role || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {contacts.length > 5 && (
            <div className="p-3 text-center text-sm text-muted-foreground border-t">
              + {contacts.length - 5} more contacts
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
