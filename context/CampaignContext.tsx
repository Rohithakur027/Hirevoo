'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Campaign, CampaignContact, CampaignStatus } from '@/types';

interface CampaignContextType {
  campaign: Campaign | null;
  setCampaign: (campaign: Campaign | null) => void;
  updateCampaignName: (name: string) => void;
  addContacts: (contacts: Omit<CampaignContact, 'id' | 'emailStatus'>[]) => void;
  updateContact: (contactId: string, updates: Partial<CampaignContact>) => void;
  updateContactEmail: (contactId: string, subject: string, body: string) => void;
  markContactDone: (contactId: string) => void;
  getContactById: (contactId: string) => CampaignContact | undefined;
  currentContactId: string | null;
  setCurrentContactId: (id: string | null) => void;
  resetCampaign: () => void;
  completedCount: number;
  totalCount: number;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

const STORAGE_KEY = 'current_campaign';

export function CampaignProvider({ children }: { children: React.ReactNode }) {
  const [campaign, setCampaignState] = useState<Campaign | null>(null);
  const [currentContactId, setCurrentContactId] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCampaignState(parsed);
        // Set first contact as current if none selected
        if (parsed.contacts?.length > 0) {
          setCurrentContactId(parsed.contacts[0].id);
        }
      } catch (e) {
        console.error('Failed to parse saved campaign', e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (campaign) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(campaign));
    }
  }, [campaign]);

  const setCampaign = useCallback((newCampaign: Campaign | null) => {
    setCampaignState(newCampaign);
    if (newCampaign?.contacts?.length) {
      setCurrentContactId(newCampaign.contacts[0].id);
    } else {
      setCurrentContactId(null);
    }
  }, []);

  const updateCampaignName = useCallback((name: string) => {
    setCampaignState(prev => {
      if (!prev) return prev;
      return { ...prev, name, updatedAt: new Date().toISOString() };
    });
  }, []);

  const addContacts = useCallback((contacts: Omit<CampaignContact, 'id' | 'emailStatus'>[]) => {
    const newContacts: CampaignContact[] = contacts.map((c, index) => ({
      ...c,
      id: `contact-${Date.now()}-${index}`,
      emailStatus: 'pending' as const,
    }));

    setCampaignState(prev => {
      if (!prev) {
        // Create new campaign
        const newCampaign: Campaign = {
          id: `campaign-${Date.now()}`,
          name: 'New Campaign',
          status: 'draft',
          contacts: newContacts,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return newCampaign;
      }
      return {
        ...prev,
        contacts: [...prev.contacts, ...newContacts],
        updatedAt: new Date().toISOString(),
      };
    });

    // Set first new contact as current
    if (newContacts.length > 0) {
      setCurrentContactId(newContacts[0].id);
    }
  }, []);

  const updateContact = useCallback((contactId: string, updates: Partial<CampaignContact>) => {
    setCampaignState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        contacts: prev.contacts.map(c =>
          c.id === contactId ? { ...c, ...updates } : c
        ),
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const updateContactEmail = useCallback((contactId: string, subject: string, body: string) => {
    setCampaignState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        contacts: prev.contacts.map(c =>
          c.id === contactId
            ? { ...c, emailSubject: subject, emailBody: body, emailStatus: 'draft' as const }
            : c
        ),
        status: 'composing' as CampaignStatus,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const markContactDone = useCallback((contactId: string) => {
    setCampaignState(prev => {
      if (!prev) return prev;
      
      const updatedContacts = prev.contacts.map(c =>
        c.id === contactId ? { ...c, emailStatus: 'done' as const } : c
      );
      
      // Check if all done
      const allDone = updatedContacts.every(c => c.emailStatus === 'done');
      
      return {
        ...prev,
        contacts: updatedContacts,
        status: allDone ? 'ready' : 'composing',
        updatedAt: new Date().toISOString(),
      };
    });

    // Move to next pending contact
    setCampaignState(prev => {
      if (!prev) return prev;
      const nextPending = prev.contacts.find(c => c.id !== contactId && c.emailStatus !== 'done');
      if (nextPending) {
        setCurrentContactId(nextPending.id);
      }
      return prev;
    });
  }, []);

  const getContactById = useCallback((contactId: string) => {
    return campaign?.contacts.find(c => c.id === contactId);
  }, [campaign]);

  const resetCampaign = useCallback(() => {
    setCampaignState(null);
    setCurrentContactId(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const completedCount = campaign?.contacts.filter(c => c.emailStatus === 'done').length ?? 0;
  const totalCount = campaign?.contacts.length ?? 0;

  return (
    <CampaignContext.Provider
      value={{
        campaign,
        setCampaign,
        updateCampaignName,
        addContacts,
        updateContact,
        updateContactEmail,
        markContactDone,
        getContactById,
        currentContactId,
        setCurrentContactId,
        resetCampaign,
        completedCount,
        totalCount,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
}

export function useCampaign() {
  const context = useContext(CampaignContext);
  if (context === undefined) {
    throw new Error('useCampaign must be used within a CampaignProvider');
  }
  return context;
}
