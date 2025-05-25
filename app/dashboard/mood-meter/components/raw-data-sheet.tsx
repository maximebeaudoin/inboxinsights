'use client';

import { useState } from 'react';

import { encode } from 'html-entities';
import { ChevronDown, ChevronRight, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import type { MoodEntry } from '@/lib/types/mood-entry';

interface RawDataSheetProps {
  entry: MoodEntry;
  className?: string;
}

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({ title, children, defaultOpen = true }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="border-muted">
      <CardHeader
        className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          <span>{title}</span>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </CardTitle>
      </CardHeader>
      {isOpen && <CardContent className="p-4">{children}</CardContent>}
    </Card>
  );
}

interface DataRowProps {
  label: string;
  value: string | number | null | undefined;
  mono?: boolean;
  encode?: boolean;
}

function DataRow({ label, value, mono = false, encode: shouldEncode = false }: DataRowProps) {
  if (!value && value !== 0) return null;

  const displayValue = shouldEncode && typeof value === 'string' ? encode(value) : String(value);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-3 py-1.5 border-b border-muted/30 last:border-b-0">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}:
      </span>
      <span
        className={`text-xs break-words col-span-2 ${
          mono ? 'font-mono bg-muted/50 px-2 py-1 rounded text-muted-foreground' : ''
        }`}
      >
        {displayValue}
      </span>
    </div>
  );
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
      <SheetContent className="w-full sm:w-[600px] sm:max-w-[800px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Raw Entry Data</SheetTitle>
          <SheetDescription>Complete raw data and metadata for this mood entry</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {/* Original Text */}
          {entry.original_text && (
            <CollapsibleSection title="Original Text" defaultOpen={true}>
              <div className="bg-muted/50 p-4 rounded-lg border border-muted">
                <pre className="text-sm whitespace-pre-wrap break-words font-mono leading-relaxed">
                  {encode(entry.original_text)}
                </pre>
              </div>
            </CollapsibleSection>
          )}

          {/* Core Identifiers */}
          <CollapsibleSection title="Core Identifiers" defaultOpen={true}>
            <div className="space-y-0">
              <DataRow label="Entry ID" value={entry.id} mono />
              <DataRow label="Email Entry ID" value={entry.email_entry_id} mono />
              <DataRow label="Subject" value={entry.subject} encode />
            </div>
          </CollapsibleSection>

          {/* Mood Metrics */}
          <CollapsibleSection title="Mood Metrics" defaultOpen={true}>
            <div className="space-y-0">
              <DataRow label="Mood Score" value={`${entry.mood_score}/10`} />
              <DataRow
                label="Energy Level"
                value={entry.energy_level ? `${entry.energy_level}/10` : null}
              />
              <DataRow
                label="Stress Level"
                value={entry.stress_level ? `${entry.stress_level}/10` : null}
              />
              <DataRow
                label="Sleep Hours"
                value={entry.sleep_hours ? `${entry.sleep_hours}h` : null}
              />
            </div>
          </CollapsibleSection>

          {/* Additional Details */}
          {(entry.note || entry.weather || entry.activity) && (
            <CollapsibleSection title="Additional Details" defaultOpen={false}>
              <div className="space-y-0">
                <DataRow label="Note" value={entry.note} encode />
                <DataRow label="Weather" value={entry.weather} encode />
                <DataRow label="Activity" value={entry.activity} encode />
              </div>
            </CollapsibleSection>
          )}

          {/* Source Information */}
          <CollapsibleSection title="Source Information" defaultOpen={false}>
            <div className="space-y-0">
              <DataRow label="From Email" value={entry.from || 'N/A'} mono />
              <DataRow label="From Name" value={entry.from_name} />
              <DataRow label="Created At" value={entry.created_at} mono />
            </div>
          </CollapsibleSection>

          {/* Content Moderation */}
          {entry.email_violation && (
            <CollapsibleSection title="Content Moderation" defaultOpen={false}>
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
                  <div className="space-y-4">
                    <div className="space-y-0">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-3 py-1.5 border-b border-muted/30">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Flagged:
                        </span>
                        <span
                          className={`text-xs font-medium col-span-2 ${
                            violation.flagged ? 'text-red-600' : 'text-green-600'
                          }`}
                        >
                          {violation.flagged ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <DataRow label="Violation ID" value={violation.id} mono />
                      <DataRow label="Moderation Date" value={violation.created_at} mono />
                    </div>

                    {violation.flagged && flaggedCategories.length > 0 && (
                      <div>
                        <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                          Violation Categories:
                        </h5>
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
                  </div>
                );
              })()}
            </CollapsibleSection>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
