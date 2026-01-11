'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { availableRoles, availableLocations, companyStages, techStackOptions } from '@/lib/mock-data';
import {
  User,
  Target,
  Code2,
  Link as LinkIcon,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Wand2,
  X,
} from 'lucide-react';

const steps = [
  { id: 1, title: 'About You', icon: User },
  { id: 2, title: 'Job Preferences', icon: Target },
  { id: 3, title: 'Skills', icon: Code2 },
  { id: 4, title: 'Portfolio', icon: LinkIcon },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    currentStatus: '',
    linkedinUrl: '',
    targetRoles: [] as string[],
    experienceLevel: '',
    preferredLocations: [] as string[],
    companyStages: [] as string[],
    techStack: [] as string[],
    portfolioUrl: '',
    githubUrl: '',
  });
  const [skillInput, setSkillInput] = useState('');

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      router.push('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleArrayItem = (array: string[], item: string, key: keyof typeof formData) => {
    const newArray = array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
    setFormData({ ...formData, [key]: newArray });
  };

  const addSkill = (skill: string) => {
    if (skill && !formData.techStack.includes(skill)) {
      setFormData({ ...formData, techStack: [...formData.techStack, skill] });
    }
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, techStack: formData.techStack.filter(s => s !== skill) });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Let&apos;s get to know you</h2>
              <p className="text-muted-foreground">Tell us a bit about yourself</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Alex Chen"
                />
              </div>
              <div className="space-y-2">
                <Label>Current Status</Label>
                <Select
                  value={formData.currentStatus}
                  onValueChange={(v) => setFormData({ ...formData, currentStatus: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your current status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="recent_grad">Recent Graduate</SelectItem>
                    <SelectItem value="employed">Employed (Looking)</SelectItem>
                    <SelectItem value="unemployed">Actively Searching</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>LinkedIn URL (Optional)</Label>
                <Input
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">What are you looking for?</h2>
              <p className="text-muted-foreground">Help us find the right opportunities</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Target Roles (Select all that apply)</Label>
                <div className="flex flex-wrap gap-2">
                  {availableRoles.slice(0, 8).map(role => (
                    <Badge
                      key={role}
                      variant={formData.targetRoles.includes(role) ? 'default' : 'outline'}
                      className={`cursor-pointer transition-all ${
                        formData.targetRoles.includes(role) ? 'bg-primary scale-105' : 'hover:bg-muted'
                      }`}
                      onClick={() => toggleArrayItem(formData.targetRoles, role, 'targetRoles')}
                    >
                      {formData.targetRoles.includes(role) && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Experience Level</Label>
                <Select
                  value={formData.experienceLevel}
                  onValueChange={(v) => setFormData({ ...formData, experienceLevel: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="intern">Intern</SelectItem>
                    <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                    <SelectItem value="mid">Mid Level (2-5 years)</SelectItem>
                    <SelectItem value="senior">Senior (5+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label>Preferred Locations</Label>
                <div className="flex flex-wrap gap-2">
                  {availableLocations.slice(0, 6).map(location => (
                    <Badge
                      key={location}
                      variant={formData.preferredLocations.includes(location) ? 'default' : 'outline'}
                      className={`cursor-pointer transition-all ${
                        formData.preferredLocations.includes(location) ? 'bg-primary scale-105' : 'hover:bg-muted'
                      }`}
                      onClick={() => toggleArrayItem(formData.preferredLocations, location, 'preferredLocations')}
                    >
                      {location}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <Label>Company Stage Preference</Label>
                <div className="flex flex-wrap gap-2">
                  {companyStages.map(stage => (
                    <Badge
                      key={stage}
                      variant={formData.companyStages.includes(stage) ? 'default' : 'outline'}
                      className={`cursor-pointer transition-all ${
                        formData.companyStages.includes(stage) ? 'bg-primary scale-105' : 'hover:bg-muted'
                      }`}
                      onClick={() => toggleArrayItem(formData.companyStages, stage, 'companyStages')}
                    >
                      {stage}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Your Tech Stack</h2>
              <p className="text-muted-foreground">AI uses this to match you with companies</p>
            </div>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 min-h-[60px] p-4 rounded-lg border bg-muted/30">
                {formData.techStack.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Click skills below or search to add</p>
                ) : (
                  formData.techStack.map(skill => (
                    <Badge key={skill} variant="secondary" className="gap-1 pr-1 h-7">
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-1 hover:bg-muted rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                )}
              </div>
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSkill(skillInput)}
                placeholder="Search or type to add..."
                className="text-center"
              />
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Popular Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {techStackOptions
                    .filter(t => !formData.techStack.includes(t))
                    .filter(t => !skillInput || t.toLowerCase().includes(skillInput.toLowerCase()))
                    .slice(0, 15)
                    .map(tech => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => addSkill(tech)}
                      >
                        + {tech}
                      </Badge>
                    ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Portfolio & Links</h2>
              <p className="text-muted-foreground">Optional - helps AI personalize your emails</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Portfolio Website</Label>
                <Input
                  value={formData.portfolioUrl}
                  onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                  placeholder="https://yourportfolio.com"
                />
              </div>
              <div className="space-y-2">
                <Label>GitHub</Label>
                <Input
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  placeholder="https://github.com/username"
                />
              </div>
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Wand2 className="h-4 w-4" />
                  <span className="font-medium">Pro Tip</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  You can add your projects later in your profile. AI will reference them
                  when writing personalized cold emails!
                </p>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 dark:bg-white">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white dark:text-gray-900">
                <path d="M5 5V19M5 12H13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M13 7L18 12L13 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="19.5" cy="12" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <span className="font-bold text-2xl">Hirevoo</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-3">
            {steps.map((step) => {
              const StepIcon = step.icon;
              const isActive = step.id === currentStep;
              const isComplete = step.id < currentStep;
              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center ${
                    isActive ? 'text-primary' : isComplete ? 'text-emerald-500' : 'text-muted-foreground'
                  }`}
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-all
                    ${isActive ? 'bg-primary text-primary-foreground scale-110' : 
                      isComplete ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-muted'}
                  `}>
                    {isComplete ? <CheckCircle2 className="h-5 w-5" /> : <StepIcon className="h-5 w-5" />}
                  </div>
                  <span className="text-xs font-medium hidden sm:block">{step.title}</span>
                </div>
              );
            })}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Card */}
        <Card className="border-0 shadow-xl">
          <CardContent className="pt-8 pb-6">
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                className="gap-2 gradient-primary text-white"
              >
                {currentStep === steps.length ? 'Complete Setup' : 'Continue'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Skip */}
        <div className="text-center mt-4">
          <Button
            variant="link"
            onClick={() => router.push('/dashboard')}
            className="text-muted-foreground"
          >
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  );
}
