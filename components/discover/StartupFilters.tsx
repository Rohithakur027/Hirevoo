'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DiscoverFilters } from '@/types';
import { availableRoles, availableLocations, companyStages, techStackOptions } from '@/lib/mock-data';
import { Search, X, SlidersHorizontal } from 'lucide-react';

interface StartupFiltersProps {
  filters: DiscoverFilters;
  onFiltersChange: (filters: DiscoverFilters) => void;
  resultCount: number;
}

export function StartupFilters({ filters, onFiltersChange, resultCount }: StartupFiltersProps) {
  const [techInput, setTechInput] = useState('');
  const [showTechSuggestions, setShowTechSuggestions] = useState(false);

  const handleRoleChange = (role: string) => {
    onFiltersChange({ ...filters, role });
  };

  const handleLocationChange = (location: string) => {
    onFiltersChange({ ...filters, location });
  };

  const handleStageToggle = (stage: string) => {
    const newStages = filters.stages.includes(stage)
      ? filters.stages.filter(s => s !== stage)
      : [...filters.stages, stage];
    onFiltersChange({ ...filters, stages: newStages });
  };

  const handleAddTech = (tech: string) => {
    if (tech && !filters.techStack.includes(tech)) {
      onFiltersChange({ ...filters, techStack: [...filters.techStack, tech] });
    }
    setTechInput('');
    setShowTechSuggestions(false);
  };

  const handleRemoveTech = (tech: string) => {
    onFiltersChange({ ...filters, techStack: filters.techStack.filter(t => t !== tech) });
  };

  const clearFilters = () => {
    onFiltersChange({
      role: '',
      location: '',
      stages: [],
      techStack: [],
    });
  };

  const filteredTechOptions = techStackOptions.filter(
    tech => tech.toLowerCase().includes(techInput.toLowerCase()) && !filters.techStack.includes(tech)
  );

  const hasFilters = filters.role || filters.location || filters.stages.length > 0 || filters.techStack.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Discover Startups Hiring</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{resultCount} results</span>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Filter Row 1: Role and Location */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Role</label>
          <Select value={filters.role} onValueChange={handleRoleChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {availableRoles.map(role => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Location</label>
          <Select value={filters.location} onValueChange={handleLocationChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {availableLocations.map(loc => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filter Row 2: Stage */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Company Stage</label>
        <div className="flex flex-wrap gap-2">
          {companyStages.map(stage => (
            <label
              key={stage}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                checked={filters.stages.includes(stage)}
                onCheckedChange={() => handleStageToggle(stage)}
              />
              <span className="text-sm">{stage}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Filter Row 3: Tech Stack */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Tech Stack</label>
        <div className="flex flex-wrap items-center gap-2">
          {filters.techStack.map(tech => (
            <Badge key={tech} variant="secondary" className="gap-1 pr-1">
              {tech}
              <button
                onClick={() => handleRemoveTech(tech)}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <div className="relative">
            <Input
              placeholder="+ Add tech"
              value={techInput}
              onChange={(e) => {
                setTechInput(e.target.value);
                setShowTechSuggestions(true);
              }}
              onFocus={() => setShowTechSuggestions(true)}
              className="w-32 h-8 text-sm"
            />
            {showTechSuggestions && techInput && filteredTechOptions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg z-10 max-h-40 overflow-auto">
                {filteredTechOptions.slice(0, 5).map(tech => (
                  <button
                    key={tech}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted"
                    onClick={() => handleAddTech(tech)}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
