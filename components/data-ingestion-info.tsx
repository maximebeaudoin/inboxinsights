/**
 * DataIngestionInfo Component
 *
 * A reusable component that displays instructions for sending mood data via email.
 *
 * Usage examples:
 *
 * // Full version with all instructions (default)
 * <DataIngestionInfo />
 * <DataIngestionInfo variant="default" />
 *
 * // Compact version for dashboards or sidebars
 * <DataIngestionInfo variant="compact" />
 *
 * // Without title
 * <DataIngestionInfo showTitle={false} />
 *
 * // With custom styling
 * <DataIngestionInfo className="my-custom-class" variant="compact" />
 */
'use client';

import { AlertCircle, Mail, Send } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { APP_CONFIG } from '@/lib/config';

import { useToast } from '@/hooks/use-toast';

/**
 * DataIngestionInfo Component
 *
 * A reusable component that displays instructions for sending mood data via email.
 *
 * Usage examples:
 *
 * // Full version with all instructions (default)
 * <DataIngestionInfo />
 * <DataIngestionInfo variant="default" />
 *
 * // Compact version for dashboards or sidebars
 * <DataIngestionInfo variant="compact" />
 *
 * // Without title
 * <DataIngestionInfo showTitle={false} />
 *
 * // With custom styling
 * <DataIngestionInfo className="my-custom-class" variant="compact" />
 */

/**
 * DataIngestionInfo Component
 *
 * A reusable component that displays instructions for sending mood data via email.
 *
 * Usage examples:
 *
 * // Full version with all instructions (default)
 * <DataIngestionInfo />
 * <DataIngestionInfo variant="default" />
 *
 * // Compact version for dashboards or sidebars
 * <DataIngestionInfo variant="compact" />
 *
 * // Without title
 * <DataIngestionInfo showTitle={false} />
 *
 * // With custom styling
 * <DataIngestionInfo className="my-custom-class" variant="compact" />
 */

interface DataIngestionInfoProps {
  showTitle?: boolean;
  className?: string;
  variant?: 'default' | 'compact';
}

export function DataIngestionInfo({
  showTitle = true,
  className = '',
  variant = 'default',
}: DataIngestionInfoProps) {
  const { toast } = useToast();

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied!',
        description: `${label} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Unable to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`space-y-3 ${className}`}>
        {showTitle && (
          <div className="flex items-center gap-2">
            <Send className="h-4 w-4 text-green-500" />
            <h4 className="font-semibold">Send Mood Data via Email</h4>
          </div>
        )}

        <div className="space-y-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="space-y-2">
            <Label className="text-xs font-medium flex items-center gap-2">
              <Mail className="h-3 w-3" />
              Email Address:
            </Label>
            <Input
              value={APP_CONFIG.dataIngestion.email}
              readOnly
              className="font-mono text-xs h-8 cursor-pointer"
              onClick={(e) => {
                e.currentTarget.select();
                handleCopy(e.currentTarget.value, 'Data ingestion email');
              }}
            />
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Send your mood updates to this email address
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {showTitle && (
        <div className="flex items-center gap-2">
          <Send className="h-4 w-4 text-green-500" />
          <h3 className="text-lg font-semibold">How to Send Mood Data</h3>
        </div>
      )}

      <div className="space-y-4 text-sm">
        <p className="text-muted-foreground">
          Send an email with your mood data to automatically track and analyze your emotional
          well-being. The system will process your message and extract mood information using AI.
        </p>

        {/* Data Ingestion Email */}
        <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="text-sm font-semibold flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Send className="h-3 w-3" />
            Data Ingestion Email
          </h4>
          <div className="space-y-2">
            <Label className="text-xs font-medium flex items-center gap-2">
              <Mail className="h-3 w-3" />
              Send Data To:
            </Label>
            <Input
              value={APP_CONFIG.dataIngestion.email}
              readOnly
              className="font-mono text-xs h-8 cursor-pointer"
              onClick={(e) => {
                e.currentTarget.select();
                handleCopy(e.currentTarget.value, 'Data ingestion email');
              }}
            />
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Click the email address above to copy it to your clipboard
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-3">
          <h4 className="font-medium">Email Format Examples:</h4>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="p-3 bg-muted/50 rounded border">
              <p className="font-medium mb-1">Subject: Daily Mood Check</p>
              <p>
                Feeling great today! Had a good night's sleep (8 hours) and went for a morning run.
                Energy level is high, stress is low. Weather is sunny which always boosts my mood.
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded border">
              <p className="font-medium mb-1">Subject: Rough Day</p>
              <p>
                Not feeling my best today. Work was stressful and I only got 5 hours of sleep. Mood
                is low, energy is drained. Need to focus on self-care tonight.
              </p>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-sm">Important Notes</AlertTitle>
          <AlertDescription className="text-xs space-y-1">
            <p>• Send emails from the same address you used to sign up for accurate tracking</p>
            <p>
              • Include details like sleep hours, activities, weather, and stress levels for better
              analysis
            </p>
            <p>• The AI will automatically extract mood scores, energy levels, and other metrics</p>
            <p>• Your data will appear on the dashboard in real-time after processing</p>
          </AlertDescription>
        </Alert>

        {/* What Gets Tracked */}
        <div className="space-y-2">
          <h4 className="font-medium">What Gets Automatically Tracked:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="space-y-1">
              <p>• Mood Score (1-10)</p>
              <p>• Energy Level</p>
              <p>• Stress Level</p>
              <p>• Sleep Hours</p>
            </div>
            <div className="space-y-1">
              <p>• Activities</p>
              <p>• Weather Conditions</p>
              <p>• Personal Notes</p>
              <p>• Emotional Context</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
