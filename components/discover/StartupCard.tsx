'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Company } from '@/types';
import { cn } from '@/lib/utils';
import { Building2, Users, MapPin, ExternalLink, UserPlus } from 'lucide-react';

interface StartupCardProps {
  company: Company;
  index?: number;
}

export function StartupCard({ company, index = 0 }: StartupCardProps) {
  const matchScore = company.openPositions[0]?.matchScore || 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/30 h-full">
        <CardContent className="p-5 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {company.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {company.description}
                </p>
              </div>
            </div>
          </div>

          {/* Funding Badge */}
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              {company.fundingStage} {company.fundingAmount && `- ${company.fundingAmount}`}
            </Badge>
            {company.isHiring && (
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                🟢 Hiring
              </Badge>
            )}
          </div>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {company.techStack.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs px-2 py-0">
                {tech}
              </Badge>
            ))}
            {company.techStack.length > 4 && (
              <Badge variant="outline" className="text-xs px-2 py-0">
                +{company.techStack.length - 4}
              </Badge>
            )}
          </div>

          {/* Info Row */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {company.teamSize} people
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {company.isRemote ? 'Remote' : company.location.split(',')[0]}
            </span>
          </div>

          {/* Open Position */}
          {company.openPositions[0] && (
            <div className="bg-muted/50 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{company.openPositions[0].title}</p>
                  <p className="text-xs text-muted-foreground">{company.openPositions[0].location}</p>
                </div>
                {matchScore > 0 && (
                  <Badge 
                    className={cn(
                      'text-xs',
                      matchScore >= 90 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      matchScore >= 75 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-muted text-muted-foreground'
                    )}
                  >
                    {matchScore}% match
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 mt-auto">
            <Button
              variant="outline"
              className="flex-1"
              disabled
              title="Company discovery is coming in Phase 2"
            >
              Details (Phase 2)
            </Button>
            <Button size="icon" variant="outline" className="shrink-0" disabled title="Coming in Phase 2">
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
