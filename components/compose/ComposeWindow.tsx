'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Send,
  Minus,
  Maximize2,
  X,
  ChevronDown,
  Bold,
  Italic,
  Underline,
  Paperclip,
  Link,
  Image,
  Smile,
  MoreVertical,
  Trash2,
  Type,
  Wand2,
} from 'lucide-react';

interface ComposeWindowProps {
  defaultTo?: string;
  defaultSubject?: string;
  defaultBody?: string;
  onSend?: (data: { to: string; subject: string; body: string }) => void;
  onClose?: () => void;
  onMinimize?: () => void;
  showAIButton?: boolean;
  onAIAssist?: () => void;
  isGenerating?: boolean;
  children?: React.ReactNode;
}

export function ComposeWindow({
  defaultTo = '',
  defaultSubject = '',
  defaultBody = '',
  onSend,
  onClose,
  onMinimize,
  showAIButton = true,
  onAIAssist,
  isGenerating = false,
  children,
}: ComposeWindowProps) {
  const [to, setTo] = useState(defaultTo);
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState(defaultBody);
  const [isMaximized, setIsMaximized] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update state when defaults change
  useEffect(() => {
    setTo(defaultTo);
  }, [defaultTo]);

  useEffect(() => {
    setSubject(defaultSubject);
  }, [defaultSubject]);

  useEffect(() => {
    setBody(defaultBody);
  }, [defaultBody]);

  const handleSend = () => {
    onSend?.({ to, subject, body });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === '/' && body === '') {
      e.preventDefault();
      onAIAssist?.();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={cn(
        'flex flex-col bg-white dark:bg-gray-900 rounded-t-lg shadow-2xl border border-border/50 overflow-hidden',
        isMaximized ? 'fixed inset-4 z-50 rounded-lg' : 'w-full max-w-2xl'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-gray-800 border-b border-border/30">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">New Message</span>
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={onMinimize}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => setIsMaximized(!isMaximized)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Recipients */}
      <div className="flex items-center border-b border-border/30">
        <span className="text-sm text-gray-500 dark:text-gray-400 px-3 py-2">To</span>
        <input
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="flex-1 text-sm bg-transparent border-none outline-none py-2 pr-3 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
          placeholder="Recipients"
        />
      </div>

      {/* Subject */}
      <div className="flex items-center border-b border-border/30">
        <span className="text-sm text-gray-500 dark:text-gray-400 px-3 py-2">Subject</span>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="flex-1 text-sm bg-transparent border-none outline-none py-2 pr-3 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
          placeholder="Subject"
        />
      </div>

      {/* Body - Can be replaced with custom children (like SpamHighlighter) */}
      <div className="flex-1 min-h-[280px] relative">
        {children || (
          <textarea
            ref={textareaRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              'w-full h-full min-h-[280px] p-3 text-sm bg-transparent border-none outline-none resize-none',
              'text-gray-900 dark:text-gray-100 placeholder:text-gray-400',
              isGenerating && 'opacity-50'
            )}
            placeholder="Press / for AI assistance"
          />
        )}
        {isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50">
            <div className="flex items-center gap-2 text-sm text-primary">
              <Wand2 className="h-4 w-4 animate-pulse" />
              <span>Generating...</span>
            </div>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-2 py-1.5 border-t border-border/30 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-1">
          {/* Send button with dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                className="h-8 px-4 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSend}
              >
                <Send className="h-3.5 w-3.5" />
                Send
                <ChevronDown className="h-3 w-3 ml-1 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Schedule send</DropdownMenuItem>
              <DropdownMenuItem>Send later</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="h-6 w-px bg-border/50 mx-1" />

          {/* Formatting buttons */}
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 dark:text-gray-400">
                  <Type className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Formatting</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 dark:text-gray-400">
                  <Bold className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Bold</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 dark:text-gray-400">
                  <Italic className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Italic</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 dark:text-gray-400">
                  <Underline className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Underline</TooltipContent>
            </Tooltip>

            <div className="h-6 w-px bg-border/50 mx-1" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 dark:text-gray-400">
                  <Paperclip className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Attach</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 dark:text-gray-400">
                  <Link className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Insert link</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 dark:text-gray-400">
                  <Smile className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Emoji</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 dark:text-gray-400">
                  <Image className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Insert photo</TooltipContent>
            </Tooltip>

            {showAIButton && (
              <>
                <div className="h-6 w-px bg-border/50 mx-1" />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-primary hover:text-primary"
                      onClick={onAIAssist}
                      disabled={isGenerating}
                    >
                      <Wand2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">AI Assist</TooltipContent>
                </Tooltip>
              </>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 dark:text-gray-400">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">More options</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Trash button */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:text-red-500"
                onClick={onClose}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Discard</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  );
}
