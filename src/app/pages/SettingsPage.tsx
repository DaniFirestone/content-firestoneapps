import { useState } from 'react';
import { Settings as SettingsIcon, Keyboard, Database } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { spacing } from '../lib/design-tokens';
import { useTheme } from '../../hooks/use-theme';
import { useAuth } from '../contexts/AuthContext';
import { claimOwnership } from '../lib/firestore';
import { seedFirestore } from '../lib/seed-firestore';
import { useData } from '../contexts/DataContext';

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const { refetch } = useData();
  const [claimStatus, setClaimStatus] = useState<string | null>(null);
  const [seedStatus, setSeedStatus] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  const shortcuts = [
    { keys: ['Cmd', 'B'], description: 'Toggle sidebar', status: 'active' },
  ];

  return (
    <div className={`${spacing.page.padding} ${spacing.page.container}`}>
      <PageHeader
        icon={SettingsIcon}
        title="Settings"
        subtitle="Customize your Content Hub experience"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode</Label>
                <div className="text-sm text-muted-foreground">
                  Switch between light and dark themes
                </div>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <div className="text-sm text-muted-foreground">Receive email updates</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <div className="text-sm text-muted-foreground">Browser notifications</div>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Data Ownership */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Data Ownership</CardTitle>
            <CardDescription>
              Assign all existing Firestore records to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">
              {user ? (
                <>Signed in as <span className="font-mono text-foreground">{user.email ?? user.uid}</span></>
              ) : (
                'Not signed in — sign in first to claim ownership.'
              )}
            </div>
            {claimStatus && (
              <div className="text-sm text-muted-foreground">{claimStatus}</div>
            )}
            <Button
              disabled={!user}
              onClick={async () => {
                if (!user) return;
                setClaimStatus('Updating records...');
                try {
                  const count = await claimOwnership(user.uid);
                  setClaimStatus(`Done — updated ${count} record(s) to your user ID.`);
                } catch (err) {
                  setClaimStatus(`Error: ${err instanceof Error ? err.message : String(err)}`);
                }
              }}
            >
              Claim Ownership
            </Button>
          </CardContent>
        </Card>

        {/* Seed Firestore */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Seed Database
            </CardTitle>
            <CardDescription>
              Populate Firestore with mock data. Safe to run multiple times — existing documents will be overwritten.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {seedStatus && (
              <div className="text-sm text-muted-foreground">{seedStatus}</div>
            )}
            <Button
              disabled={seeding || !user}
              onClick={async () => {
                if (!user) return;
                setSeeding(true);
                setSeedStatus('Seeding Firestore...');
                try {
                  const counts = await seedFirestore(user.uid);
                  setSeedStatus(
                    `Done — seeded ${counts.appConcepts} app concepts, ${counts.businesses} businesses, ${counts.tasks} tasks, ${counts.assets} assets.`,
                  );
                  await refetch();
                } catch (err) {
                  setSeedStatus(`Error: ${err instanceof Error ? err.message : String(err)}`);
                } finally {
                  setSeeding(false);
                }
              }}
            >
              {seeding ? 'Seeding...' : 'Seed Firestore'}
            </Button>
          </CardContent>
        </Card>

        {/* Keyboard Shortcuts */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              Keyboard Shortcuts
            </CardTitle>
            <CardDescription>Speed up your workflow with keyboard shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{shortcut.description}</span>
                  <div className="flex gap-1">
                    {shortcut.keys.map((key) => (
                      <Badge
                        key={key}
                        variant="outline"
                        className="font-mono text-xs tracking-widest"
                      >
                        {key}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}