'use client';

import { Globe, User } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export type ViewMode = 'personal' | 'global';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  disabled?: boolean;
}

export function ViewModeToggle({
  viewMode,
  onViewModeChange,
  disabled = false,
}: ViewModeToggleProps) {
  const isGlobal = viewMode === 'global';

  return (
    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <Label htmlFor="view-mode-toggle" className="text-sm font-medium cursor-pointer">
          Personal
        </Label>
      </div>

      <Switch
        id="view-mode-toggle"
        checked={isGlobal}
        onCheckedChange={(checked) => onViewModeChange(checked ? 'global' : 'personal')}
        disabled={disabled}
        className="data-[state=checked]:bg-blue-600"
      />

      <div className="flex items-center gap-2">
        <Label htmlFor="view-mode-toggle" className="text-sm font-medium cursor-pointer">
          Global
        </Label>
        <Globe className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="ml-2 text-xs text-muted-foreground">
        {isGlobal ? 'Viewing all users mood data' : 'Viewing your personal mood data'}
      </div>
    </div>
  );
}
