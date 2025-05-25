'use client';

import { AlertTriangle, Shield } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function PrivacyContentNotice() {
  return (
    <div className="flex flex-col gap-4">
      {/* Privacy Notice */}
      <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <AlertTitle className="text-amber-800 dark:text-amber-200">Privacy Notice</AlertTitle>
        <AlertDescription className="text-amber-700 dark:text-amber-300">
          <strong>Important:</strong> Some user data will be publicly visible, including your email
          address, name, and email content. This is a public demo application.
        </AlertDescription>
      </Alert>

      {/* Content Policy */}
      <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50">
        <Shield className="h-4 w-4 text-red-600 dark:text-red-400" />
        <AlertTitle className="text-red-800 dark:text-red-200">Content Policy</AlertTitle>
        <AlertDescription className="text-red-700 dark:text-red-300">
          Content containing sexual themes, hate speech, harassment, self-harm, violence, threats,
          or any inappropriate material will be filtered since this is one of the key feature we
          want to showcase. However, Please keep all mood tracking content appropriate and
          respectful. You can also delete any mood entry you have created (except for the demo
          user).
        </AlertDescription>
      </Alert>
    </div>
  );
}
