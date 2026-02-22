import { HelpCircle, BookOpen, Code, Activity, FileText } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { spacing } from '../lib/design-tokens';

export function HelpPage() {
  return (
    <div className={`${spacing.page.padding} ${spacing.page.container}`}>
      <PageHeader
        icon={HelpCircle}
        title="Help & Documentation"
        subtitle="Learn how to use Content Hub effectively"
      />

      <Tabs defaultValue="guide" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="guide">
            <BookOpen className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">User Guide</span>
            <span className="sm:hidden">Guide</span>
          </TabsTrigger>
          <TabsTrigger value="architecture">
            <Code className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Architecture</span>
            <span className="sm:hidden">Arch</span>
          </TabsTrigger>
          <TabsTrigger value="technical">
            <FileText className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Technical</span>
            <span className="sm:hidden">Tech</span>
          </TabsTrigger>
          <TabsTrigger value="health">
            <Activity className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Health Check</span>
            <span className="sm:hidden">Health</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="guide">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started with Content Hub</CardTitle>
              <CardDescription>Learn the basics of managing your app concepts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">Dashboard</h3>
                <p className="text-sm text-muted-foreground">
                  Your central hub showing active apps, pending tasks, and health scores. Use the prominent app search to quickly navigate to any app workspace or incubator.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Quick Capture</h3>
                <p className="text-sm text-muted-foreground">
                  Quickly capture app ideas, upload assets, or save AI prompts. Access it from the navigation menu or the floating action button on mobile.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">App Incubator</h3>
                <p className="text-sm text-muted-foreground">
                  Manage all your app concepts through their lifecycle: from idea to brainstorming, prototyping, validation, and finally published or archived.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">App Workspaces</h3>
                <p className="text-sm text-muted-foreground">
                  Deep-dive into individual apps with dedicated workspaces. Track tasks, manage assets, monitor health metrics, and prepare for launch.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Business DNA</h3>
                <p className="text-sm text-muted-foreground">
                  Create business DNA profiles with brand identity, voice, and colors. Link apps to inherit business DNA automatically for consistent branding.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">App Switcher</h3>
                <p className="text-sm text-muted-foreground">
                  Use the app switcher dropdown in the header to quickly switch between apps. Your selected app provides context throughout the platform.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="architecture">
          <Card>
            <CardHeader>
              <CardTitle>System Architecture</CardTitle>
              <CardDescription>Understanding how Content Hub is structured</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">Navigation Phases</h3>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li><strong>Create:</strong> Quick capture and initial idea generation</li>
                  <li><strong>Develop:</strong> App incubator and detailed workspace</li>
                  <li><strong>Manage:</strong> Business DNA, assets, and published apps</li>
                  <li><strong>Output:</strong> Marketing and export functionality</li>
                  <li><strong>System:</strong> Tasks, settings, and help</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Data Models</h3>
                <p className="text-sm text-muted-foreground">
                  The system organizes data into: App Concepts, Business DNA profiles, Assets (images/prompts), and Tasks.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical">
          <Card>
            <CardHeader>
              <CardTitle>Technical Documentation</CardTitle>
              <CardDescription>For developers and technical users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">Technology Stack</h3>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li>React with TypeScript</li>
                  <li>React Router for navigation</li>
                  <li>Tailwind CSS v4 for styling</li>
                  <li>Radix UI components</li>
                  <li>Lucide icons</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Design System</h3>
                <p className="text-sm text-muted-foreground">
                  The design system uses semantic color tokens, custom typography (Lato + EB Garamond), and a comprehensive spacing system.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health">
          <Card>
            <CardHeader>
              <CardTitle>Health Check Guide</CardTitle>
              <CardDescription>Understanding health scores and metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">Health Score Levels</h3>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li><strong>90-100%:</strong> Looking Good - App is well-defined and ready</li>
                  <li><strong>70-89%:</strong> Needs Attention - Some aspects need work</li>
                  <li><strong>0-69%:</strong> Blocked - Critical elements missing</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Improving Health Scores</h3>
                <p className="text-sm text-muted-foreground">
                  Complete the main prompt, add features, link to business DNA, add assets, define tech stack, and maintain regular activity.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}