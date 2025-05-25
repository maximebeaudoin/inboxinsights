'use client';

import { FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import type { MoodEntry } from '@/lib/types/mood-entry';

// HTML escape utility function - works in both server and client environments
function escapeHtml(text: string): string {
  // Server-side safe HTML escaping
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

interface RawDataSheetProps {
  entry: MoodEntry;
  className?: string;
}

export function RawDataSheet({ entry, className }: RawDataSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 p-0 text-muted-foreground hover:text-foreground hover:bg-transparent text-xs gap-1 min-w-0 ${className || ''}`}
        >
          <span className="hidden sm:inline">Show Raw Data</span>
          <span className="sm:hidden">Raw</span>
          <FileText className="h-3 w-3 flex-shrink-0" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[500px] sm:max-w-[700px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Raw Entry Data</SheetTitle>
          <SheetDescription>Original text and raw data for this mood entry</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {/* Original Text */}
          {entry.original_text && (
            <div>
              <h4 className="text-sm font-medium mb-2">Original Text</h4>
              <div className="bg-muted p-3 rounded-md border">
                <pre className="text-sm whitespace-pre-wrap break-words">
                  {escapeHtml(entry.original_text)}
                </pre>
              </div>
            </div>
          )}

          {/* Raw Data Fields */}
          <div>
            <h4 className="text-sm font-medium mb-2">Raw Data</h4>
            <div className="space-y-2 text-sm">
              {/* Core Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                <span className="font-medium">ID:</span>
                <span className="font-mono text-xs break-all">{entry.id}</span>
              </div>

              {entry.email_entry_id && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                  <span className="font-medium">Email Entry ID:</span>
                  <span className="font-mono text-xs break-all">{entry.email_entry_id}</span>
                </div>
              )}

              {entry.subject && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                  <span className="font-medium">Subject:</span>
                  <span className="text-xs break-words">{escapeHtml(entry.subject)}</span>
                </div>
              )}

              {/* Mood Data */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                <span className="font-medium">Mood Score:</span>
                <span className="font-mono text-xs">{entry.mood_score}/10</span>
              </div>

              {entry.energy_level && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                  <span className="font-medium">Energy Level:</span>
                  <span className="font-mono text-xs">{entry.energy_level}/10</span>
                </div>
              )}

              {entry.stress_level && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                  <span className="font-medium">Stress Level:</span>
                  <span className="font-mono text-xs">{entry.stress_level}/10</span>
                </div>
              )}

              {entry.sleep_hours && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                  <span className="font-medium">Sleep Hours:</span>
                  <span className="font-mono text-xs">{entry.sleep_hours}h</span>
                </div>
              )}

              {/* Text Fields */}
              {entry.note && (
                <div className="grid grid-cols-1 gap-1 sm:gap-2">
                  <span className="font-medium">Note:</span>
                  <span className="text-xs break-words">{escapeHtml(entry.note)}</span>
                </div>
              )}

              {entry.weather && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                  <span className="font-medium">Weather:</span>
                  <span className="text-xs">{escapeHtml(entry.weather)}</span>
                </div>
              )}

              {entry.activity && (
                <div className="grid grid-cols-1 gap-1 sm:gap-2">
                  <span className="font-medium">Activity:</span>
                  <span className="text-xs break-words">{escapeHtml(entry.activity)}</span>
                </div>
              )}

              {/* Source Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                <span className="font-medium">From:</span>
                <span className="font-mono text-xs break-all">{entry.from || 'N/A'}</span>
              </div>

              {entry.from_name && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                  <span className="font-medium">From Name:</span>
                  <span className="font-mono text-xs">{entry.from_name}</span>
                </div>
              )}

              {/* Timestamps */}
              <div className="grid grid-cols-1 gap-1 sm:gap-2">
                <span className="font-medium">Created At:</span>
                <span className="font-mono text-xs break-all">{entry.created_at}</span>
              </div>
            </div>
          </div>

          {/* Email Violation Data */}
          {entry.email_violation && (
            <div>
              <h4 className="text-sm font-medium mb-2">Content Moderation</h4>
              <div className="space-y-2 text-sm">
                {(() => {
                  const violation = entry.email_violation;

                  // Get flagged categories
                  const flaggedCategories = [
                    violation.sexual && 'Sexual',
                    violation.hate && 'Hate',
                    violation.harassment && 'Harassment',
                    violation.self_harm && 'Self-harm',
                    violation.sexual_minors && 'Sexual/Minors',
                    violation.hate_threatening && 'Hate/Threatening',
                    violation.violence_graphic && 'Violence/Graphic',
                    violation.self_harm_intent && 'Self-harm/Intent',
                    violation.self_harm_instructions && 'Self-harm/Instructions',
                    violation.harassment_threatening && 'Harassment/Threatening',
                    violation.violence && 'Violence',
                  ].filter((category): category is string => Boolean(category));

                  return (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                        <span className="font-medium">Flagged:</span>
                        <span
                          className={`text-xs font-medium ${violation.flagged ? 'text-red-600' : 'text-green-600'}`}
                        >
                          {violation.flagged ? 'Yes' : 'No'}
                        </span>
                      </div>

                      {violation.flagged && flaggedCategories.length > 0 && (
                        <div className="grid grid-cols-1 gap-1 sm:gap-2">
                          <span className="font-medium">Violation Categories:</span>
                          <div className="flex flex-wrap gap-1">
                            {flaggedCategories.map((category) => (
                              <span
                                key={category}
                                className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 px-2 py-1 rounded text-xs"
                              >
                                {category}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                        <span className="font-medium">Violation ID:</span>
                        <span className="font-mono text-xs break-all">{violation.id}</span>
                      </div>

                      <div className="grid grid-cols-1 gap-1 sm:gap-2">
                        <span className="font-medium">Moderation Date:</span>
                        <span className="font-mono text-xs break-all">{violation.created_at}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
