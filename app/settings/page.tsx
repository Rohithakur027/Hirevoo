'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { mockUserProfile } from '@/lib/mock-data';
import {
  Mail,
  Bell,
  Clock,
  Settings2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

export default function SettingsPage() {
  const [profile] = useState(mockUserProfile);
  const [settings, setSettings] = useState({
    autoFollowUp: true,
    followUpDays: [2, 7, 14],
    defaultTone: 'professional',
    emailNotifications: true,
    responseAlerts: true,
    weeklyDigest: true,
  });

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl space-y-6"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and email preferences.
          </p>
        </div>

        {/* Gmail Connection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Email Connection
            </CardTitle>
            <CardDescription>
              Connect your Gmail to send emails directly from Hirevoo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {profile.gmailConnected ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium">Gmail Connected</p>
                    <p className="text-sm text-muted-foreground">{profile.connectedEmail}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Disconnect
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium">No Email Connected</p>
                    <p className="text-sm text-muted-foreground">Connect Gmail to send emails</p>
                  </div>
                </div>
                <Button className="gap-2 gradient-primary text-white">
                  <Mail className="h-4 w-4" />
                  Connect Gmail
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Follow-up Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Follow-up Settings
            </CardTitle>
            <CardDescription>
              Configure automatic follow-up reminders.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto Follow-up Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Get reminded to follow up on unanswered emails
                </p>
              </div>
              <Switch
                checked={settings.autoFollowUp}
                onCheckedChange={(checked) => setSettings({ ...settings, autoFollowUp: checked })}
              />
            </div>
            
            {settings.autoFollowUp && (
              <div className="space-y-3 pt-3 border-t">
                <Label>Follow-up Schedule (days after initial email)</Label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">1st:</span>
                    <Select
                      value={settings.followUpDays[0].toString()}
                      onValueChange={(v) => {
                        const days = [...settings.followUpDays];
                        days[0] = parseInt(v);
                        setSettings({ ...settings, followUpDays: days });
                      }}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[2, 3, 4, 5, 7].map(d => (
                          <SelectItem key={d} value={d.toString()}>{d} days</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">2nd:</span>
                    <Select
                      value={settings.followUpDays[1].toString()}
                      onValueChange={(v) => {
                        const days = [...settings.followUpDays];
                        days[1] = parseInt(v);
                        setSettings({ ...settings, followUpDays: days });
                      }}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[7, 8, 10, 14].map(d => (
                          <SelectItem key={d} value={d.toString()}>{d} days</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Final:</span>
                    <Select
                      value={settings.followUpDays[2].toString()}
                      onValueChange={(v) => {
                        const days = [...settings.followUpDays];
                        days[2] = parseInt(v);
                        setSettings({ ...settings, followUpDays: days });
                      }}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[14, 18, 21, 28].map(d => (
                          <SelectItem key={d} value={d.toString()}>{d} days</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Email Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-primary" />
              Email Preferences
            </CardTitle>
            <CardDescription>
              Default settings for your cold emails.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Default Email Tone</Label>
              <Select
                value={settings.defaultTone}
                onValueChange={(v) => setSettings({ ...settings, defaultTone: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>
              Control what notifications you receive.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications for important updates
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Response Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified immediately when you receive a response
                </p>
              </div>
              <Switch
                checked={settings.responseAlerts}
                onCheckedChange={(checked) => setSettings({ ...settings, responseAlerts: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Weekly Digest</Label>
                <p className="text-sm text-muted-foreground">
                  Summary of your job hunt progress every week
                </p>
              </div>
              <Switch
                checked={settings.weeklyDigest}
                onCheckedChange={(checked) => setSettings({ ...settings, weeklyDigest: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible actions for your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account, all applications, email history, and profile data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}
