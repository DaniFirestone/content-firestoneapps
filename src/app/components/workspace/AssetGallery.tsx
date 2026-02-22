import { useState } from 'react';
import { Image as ImageIcon, FileText, Loader2, CheckCircle2, AlertCircle, Eye } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

interface PrototypeAsset {
  id: string;
  title?: string;
  assetUrl: string;
  assetType?: 'image' | 'link' | 'file';
  processingStatus?: 'inbox' | 'extracting-text' | 'generating-prompt' | 'ready' | 'failed';
  aiGeneratedDescription?: string;
  ocrData?: {
    text: string;
    confidence: number;
    wordCount: number;
  };
  aiAnalysis?: {
    visualElements?: string[];
    dominantColors?: string[];
    styleCharacteristics?: string;
  };
}

interface AssetGalleryProps {
  assetIds: string[];
}

// Mock asset data
const mockAssets: Record<string, PrototypeAsset> = {
  asset_101: {
    id: 'asset_101',
    title: 'Landing Page Mockup',
    assetUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
    assetType: 'image',
    processingStatus: 'ready',
    aiGeneratedDescription: 'Clean, modern landing page design with blue accent colors',
    aiAnalysis: {
      visualElements: ['Hero section', 'CTA buttons', 'Feature cards'],
      dominantColors: ['#2563EB', '#F8FAFC', '#0F172A'],
      styleCharacteristics: 'Minimalist, professional, SaaS-focused',
    },
  },
  asset_102: {
    id: 'asset_102',
    title: 'User Flow Diagram',
    assetUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    assetType: 'image',
    processingStatus: 'extracting-text',
  },
};

export function AssetGallery({ assetIds }: AssetGalleryProps) {
  const [selectedAsset, setSelectedAsset] = useState<PrototypeAsset | null>(null);
  
  const assets = assetIds.map((id) => mockAssets[id]).filter(Boolean);

  const getStatusBadge = (status?: PrototypeAsset['processingStatus']) => {
    switch (status) {
      case 'inbox':
        return (
          <Badge variant="outline" className="text-xs gap-1">
            <FileText className="h-3 w-3" />
            Inbox
          </Badge>
        );
      case 'extracting-text':
        return (
          <Badge variant="outline" className="text-xs gap-1 text-blue-600 border-blue-600">
            <Loader2 className="h-3 w-3 animate-spin" />
            Extracting Text
          </Badge>
        );
      case 'generating-prompt':
        return (
          <Badge variant="outline" className="text-xs gap-1 text-purple-600 border-purple-600">
            <Loader2 className="h-3 w-3 animate-spin" />
            Generating Prompt
          </Badge>
        );
      case 'ready':
        return (
          <Badge variant="outline" className="text-xs gap-1 text-emerald-600 border-emerald-600">
            <CheckCircle2 className="h-3 w-3" />
            Ready
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="text-xs gap-1 text-red-600 border-red-600">
            <AlertCircle className="h-3 w-3" />
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  if (assets.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed p-8 text-center">
        <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm font-medium mb-1">No prototype assets yet</p>
        <p className="text-xs text-muted-foreground">
          Upload screenshots, mockups, or reference images
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        {assets.map((asset) => (
          <button
            key={asset.id}
            onClick={() => setSelectedAsset(asset)}
            className="group relative aspect-video rounded-lg overflow-hidden border hover:border-primary transition-colors"
          >
            <img
              src={asset.assetUrl}
              alt={asset.title || 'Asset'}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <p className="text-xs font-medium text-white truncate">
                  {asset.title || 'Untitled'}
                </p>
              </div>
              <div className="absolute top-2 right-2">
                <Eye className="h-4 w-4 text-white" />
              </div>
            </div>

            {/* Status Badge */}
            <div className="absolute top-2 left-2">
              {getStatusBadge(asset.processingStatus)}
            </div>
          </button>
        ))}
      </div>

      {/* Asset Detail Dialog */}
      <Dialog open={selectedAsset !== null} onOpenChange={() => setSelectedAsset(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedAsset?.title || 'Asset Details'}</DialogTitle>
            <DialogDescription>
              AI analysis and extracted information
            </DialogDescription>
          </DialogHeader>

          {selectedAsset && (
            <div className="space-y-4">
              {/* Image Preview */}
              <div className="rounded-lg overflow-hidden border">
                <img
                  src={selectedAsset.assetUrl}
                  alt={selectedAsset.title || 'Asset'}
                  className="w-full h-auto"
                />
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Processing Status:</span>
                {getStatusBadge(selectedAsset.processingStatus)}
              </div>

              {/* AI Analysis */}
              {selectedAsset.aiAnalysis && (
                <div className="rounded-lg bg-purple-50 border border-purple-200 p-4">
                  <h4 className="text-sm font-semibold text-purple-900 mb-3">
                    Visual Analysis
                  </h4>
                  
                  {selectedAsset.aiAnalysis.visualElements && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-purple-700 mb-1">
                        Visual Elements:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {selectedAsset.aiAnalysis.visualElements.map((element, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {element}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedAsset.aiAnalysis.dominantColors && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-purple-700 mb-1">
                        Dominant Colors:
                      </p>
                      <div className="flex gap-2">
                        {selectedAsset.aiAnalysis.dominantColors.map((color, i) => (
                          <div key={i} className="flex items-center gap-1">
                            <div
                              className="w-6 h-6 rounded border"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-xs font-mono">{color}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedAsset.aiAnalysis.styleCharacteristics && (
                    <div>
                      <p className="text-xs font-medium text-purple-700 mb-1">
                        Style:
                      </p>
                      <p className="text-sm">
                        {selectedAsset.aiAnalysis.styleCharacteristics}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* OCR Data */}
              {selectedAsset.ocrData && (
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">
                    Extracted Text
                  </h4>
                  <div className="flex items-center gap-4 mb-2 text-xs text-blue-700">
                    <span>Words: {selectedAsset.ocrData.wordCount}</span>
                    <span>Confidence: {Math.round(selectedAsset.ocrData.confidence * 100)}%</span>
                  </div>
                  <div className="rounded bg-white/50 p-3 text-sm font-mono max-h-40 overflow-y-auto">
                    {selectedAsset.ocrData.text}
                  </div>
                </div>
              )}

              {/* AI Description */}
              {selectedAsset.aiGeneratedDescription && (
                <div className="rounded-lg bg-muted p-4">
                  <h4 className="text-sm font-semibold mb-2">AI Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedAsset.aiGeneratedDescription}
                  </p>
                </div>
              )}

              <Button variant="outline" className="w-full">
                Add to Library
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
