import { useState } from 'react';
import { Camera, FileText, Sparkles, Plus } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { AppContextBar } from '../components/layout/AppContextBar';
import { AppSelectorCard } from '../components/layout/AppSelectorCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { ScanText } from 'lucide-react';
import { toast } from 'sonner';
import { spacing } from '../lib/design-tokens';
import { mockBusinesses } from '../lib/mock-data';
import { useSelectedApp } from '../contexts/SelectedAppContext';
 
export function QuickCapturePage() {
  const { selectedApp } = useSelectedApp();
  const [ideaName, setIdeaName] = useState('');
  const [ideaDescription, setIdeaDescription] = useState('');
  const [ideaBusiness, setIdeaBusiness] = useState('');
  const [promptText, setPromptText] = useState('');
  const [promptTags, setPromptTags] = useState('');
  const [promptTitle, setPromptTitle] = useState('');
  const [promptNotes, setPromptNotes] = useState('');
  const [assetTitle, setAssetTitle] = useState('');
  const [assetNotes, setAssetNotes] = useState('');

  const handleIdeaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('App idea captured! It will appear in the App Incubator.');
    setIdeaName('');
    setIdeaDescription('');
    setIdeaBusiness('');
  };

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = selectedApp 
      ? `Prompt saved to ${selectedApp.name}!`
      : 'Prompt snippet saved to your asset library!';
    toast.success(message);
    setPromptTitle('');
    setPromptText('');
    setPromptTags('');
    setPromptNotes('');
  };

  return (
    <div className={`${spacing.page.padding} ${spacing.page.container}`}>
      <PageHeader
        icon={Sparkles}
        title="Quick Capture"
        subtitle="Capture inspiration as it strikes—ideas, screenshots, prompts—save them all in seconds"
      />

      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Capture App Idea */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Plus className="h-4 w-4 text-blue-600" />
              </div>
              Capture App Idea
            </CardTitle>
            <CardDescription>
              Jot down your next big concept
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleIdeaSubmit} className={spacing.form.gap}>
              <div className="space-y-2">
                <Label htmlFor="idea-name">App Name</Label>
                <Input
                  id="idea-name"
                  value={ideaName}
                  onChange={(e) => setIdeaName(e.target.value)}
                  placeholder="My Awesome App"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="idea-business">
                  Business <span className="text-muted-foreground text-xs">(Optional)</span>
                </Label>
                <Select value={ideaBusiness} onValueChange={setIdeaBusiness}>
                  <SelectTrigger id="idea-business">
                    <SelectValue placeholder="Link to a business…" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockBusinesses.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="idea-description">Description</Label>
                <Textarea
                  id="idea-description"
                  value={ideaDescription}
                  onChange={(e) => setIdeaDescription(e.target.value)}
                  placeholder="Describe your app idea..."
                  rows={4}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Capture Idea
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Capture Image/Asset */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Camera className="h-4 w-4 text-purple-600" />
              </div>
              Upload Asset
            </CardTitle>
            <CardDescription>
              Add images or design files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="asset-title">Title</Label>
                <Input
                  id="asset-title"
                  value={assetTitle}
                  onChange={(e) => setAssetTitle(e.target.value)}
                  placeholder="e.g., Homepage Screenshot"
                />
              </div>

              <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <div className="space-y-2">
                  <Camera className="mx-auto h-8 w-8 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">
                    Drop files or click to browse
                  </div>
                  <Button variant="outline" size="sm">
                    Select Files
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border bg-muted/20 px-3 py-2">
                <div className="flex items-start gap-2">
                  <ScanText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium">AI Text Extraction</p>
                    <p className="text-xs text-muted-foreground">
                      Extract text from images automatically
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="asset-notes">
                  Notes <span className="text-muted-foreground text-xs">(Optional)</span>
                </Label>
                <Textarea
                  id="asset-notes"
                  value={assetNotes}
                  onChange={(e) => setAssetNotes(e.target.value)}
                  placeholder="Add any notes..."
                  rows={2}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Prompt Snippet */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-green-500/10">
                <FileText className="h-4 w-4 text-green-600" />
              </div>
              Save Prompt
            </CardTitle>
            <CardDescription>
              Store AI prompts for reuse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePromptSubmit} className={spacing.form.gap}>
              <div className="space-y-2">
                <Label htmlFor="prompt-title">Title</Label>
                <Input
                  id="prompt-title"
                  value={promptTitle}
                  onChange={(e) => setPromptTitle(e.target.value)}
                  placeholder="e.g., Landing Page Copy"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt-text">Prompt Text</Label>
                <Textarea
                  id="prompt-text"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Enter your AI prompt..."
                  rows={4}
                  className="font-mono text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt-tags">
                  Tags <span className="text-muted-foreground text-xs">(Optional)</span>
                </Label>
                <Input
                  id="prompt-tags"
                  value={promptTags}
                  onChange={(e) => setPromptTags(e.target.value)}
                  placeholder="ai, prompt, feature"
                />
              </div>

              <Button type="submit" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Save Prompt
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}