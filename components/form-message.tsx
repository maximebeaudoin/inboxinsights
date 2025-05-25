import { AlertCircle, CheckCircle, Info } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';

export type Message = { success: string } | { error: string } | { message: string };

export function FormMessage({ message }: { message: Message }) {
  return (
    <div className="flex flex-col gap-2 w-full text-sm">
      {'success' in message && (
        <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            {message.success}
          </AlertDescription>
        </Alert>
      )}
      {'error' in message && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{message.error}</AlertDescription>
        </Alert>
      )}
      {'message' in message && (
        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            {message.message}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
