'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Company } from '@/types';
import { cn } from '@/lib/utils';
import {
  Building2,
  DollarSign,
  Users,
  MapPin,
  Globe,
  Calendar,
  Star,
  Newspaper,
  Code2,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface CompanyIntelProps {
  company: Company;
  userTechStack?: string[];
}

export function CompanyIntel({ company, userTechStack = [] }: CompanyIntelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Company Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center shrink-0">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{company.name}</h1>
                {company.isHiring && (
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    🟢 Hiring
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mt-1">{company.description}</p>
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
              >
                <Globe className="h-3.5 w-3.5" />
                {company.website.replace('https://', '')}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <DollarSign className="h-4 w-4" />
              <span className="text-xs">Funding</span>
            </div>
            <p className="font-semibold">{company.fundingStage}</p>
            {company.fundingAmount && (
              <p className="text-sm text-muted-foreground">{company.fundingAmount}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Users className="h-4 w-4" />
              <span className="text-xs">Team</span>
            </div>
            <p className="font-semibold">{company.teamSize} people</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <MapPin className="h-4 w-4" />
              <span className="text-xs">Location</span>
            </div>
            <p className="font-semibold">{company.isRemote ? 'Remote-first' : company.location.split(',')[0]}</p>
          </CardContent>
        </Card>
        {company.glassdoorRating && (
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Star className="h-4 w-4" />
                <span className="text-xs">Rating</span>
              </div>
              <p className="font-semibold">{company.glassdoorRating}/5</p>
              <p className="text-sm text-muted-foreground">Glassdoor</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tech Stack */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Code2 className="h-4 w-4 text-primary" />
            Tech Stack
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {company.techStack.map(tech => {
              const isMatch = userTechStack.includes(tech);
              return (
                <Badge
                  key={tech}
                  variant={isMatch ? 'default' : 'outline'}
                  className={cn(
                    isMatch && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  )}
                >
                  {isMatch && <CheckCircle2 className="h-3 w-3 mr-1" />}
                  {tech}
                </Badge>
              );
            })}
          </div>
          {userTechStack.length > 0 && (
            <p className="text-xs text-muted-foreground mt-3">
              ✓ {company.techStack.filter(t => userTechStack.includes(t)).length} of {company.techStack.length} technologies match your profile
            </p>
          )}
        </CardContent>
      </Card>

      {/* Recent News */}
      {company.recentNews && company.recentNews.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Newspaper className="h-4 w-4 text-primary" />
              Recent News
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {company.recentNews.map((news, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-1 h-1 rounded-full bg-primary mt-2" />
                <div>
                  <p className="text-sm font-medium">{news.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {news.source} • {news.date}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Culture Notes */}
      {company.cultureNotes && company.cultureNotes.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Culture & Values</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {company.cultureNotes.map((note, index) => (
                <Badge key={index} variant="secondary">
                  {note}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Founded */}
      {company.founded && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          Founded {company.founded}
        </div>
      )}
    </motion.div>
  );
}
