'use client';

import { useEffect, useState } from 'react';

import { AlertCircle, CheckCircle, Mail, Send } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { APP_CONFIG } from '@/lib/config';

import { useToast } from '@/hooks/use-toast';

interface TestEmailModalProps {
  children: React.ReactNode;
}

interface PostmarkStatus {
  configured: boolean;
  status: string;
  message: string;
  details: {
    mode: string;
    fromEmail?: string;
  };
}

export function TestEmailModal({ children }: TestEmailModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [postmarkStatus, setPostmarkStatus] = useState<PostmarkStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [subject, setSubject] = useState('Daily Mood Update - Test Email');
  const [message, setMessage] = useState(`Hi there!

I'm testing the InboxInsights mood tracking system. Here's how I'm feeling today:

Today was a pretty good day overall. I woke up feeling refreshed after getting about 8 hours of sleep. My energy level is around 7/10 - I feel motivated and ready to tackle my tasks.

My mood is positive, probably around 8/10. I had a productive morning working on some projects, and I'm feeling accomplished. The weather is sunny which always helps boost my spirits.

Stress level is low today, maybe 3/10. I have a few deadlines coming up but nothing too overwhelming. I went for a walk during lunch which helped me feel more relaxed.

Activities today:
- Morning workout (30 minutes)
- Productive work session
- Lunch walk in the park
- Reading for 20 minutes

Looking forward to a good evening!

Best regards,
Demo User`);
  const { toast } = useToast();

  // Check Postmark status when modal opens
  useEffect(() => {
    if (open) {
      checkPostmarkStatus();
    } else {
      // Reset status when modal closes
      setPostmarkStatus(null);
    }
  }, [open]);

  const checkPostmarkStatus = async () => {
    setStatusLoading(true);
    try {
      const response = await fetch('/api/postmark-status');
      const data = await response.json();
      setPostmarkStatus(data);
    } catch (error) {
      console.error('Failed to check Postmark status:', error);
      setPostmarkStatus({
        configured: false,
        status: 'error',
        message: 'Failed to check Postmark configuration',
        details: { mode: 'simulation' },
      });
    } finally {
      setStatusLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!subject.trim() || !message.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in both subject and message fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/send-test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      toast({
        title: 'Email Sent Successfully!',
        description: data.message,
      });

      setOpen(false);
    } catch (error) {
      console.error('Error sending test email:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send test email',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSubject('Daily Mood Update - Test Email');
    setMessage(`Hi there!

I'm testing the InboxInsights mood tracking system. Here's how I'm feeling today:

Today was a pretty good day overall. I woke up feeling refreshed after getting about 8 hours of sleep. My energy level is around 7/10 - I feel motivated and ready to tackle my tasks.

My mood is positive, probably around 8/10. I had a productive morning working on some projects, and I'm feeling accomplished. The weather is sunny which always helps boost my spirits.

Stress level is low today, maybe 3/10. I have a few deadlines coming up but nothing too overwhelming. I went for a walk during lunch which helped me feel more relaxed.

Activities today:
- Morning workout (30 minutes)
- Productive work session
- Lunch walk in the park
- Reading for 20 minutes

Looking forward to a good evening!

Best regards,
Demo User`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-500" />
            Send Test Email
          </DialogTitle>
          <DialogDescription>
            Send a test mood tracking email from{' '}
            <span className="font-mono text-sm">{APP_CONFIG.demo.email}</span> to{' '}
            <span className="font-mono text-sm">{APP_CONFIG.dataIngestion.email}</span>
            <br />
            <span className="text-xs text-muted-foreground mt-1 block">
              This helps users test the mood tracking system easily without setting up their own
              email.
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {/* Postmark Status */}
          {statusLoading ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Checking Postmark configuration...</AlertDescription>
            </Alert>
          ) : postmarkStatus ? (
            <Alert
              className={
                postmarkStatus.configured
                  ? 'border-green-200 bg-green-50'
                  : 'border-yellow-200 bg-yellow-50'
              }
            >
              {postmarkStatus.configured ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              )}
              <AlertDescription>
                <span className="font-medium">{postmarkStatus.message}</span>
              </AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject..."
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your mood tracking message..."
                className="min-h-[150px] font-mono text-sm"
                disabled={isLoading}
              />
            </div>

            <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
              <p className="font-medium mb-1">💡 Tip:</p>
              <p>
                Include details about your mood (1-10), energy level, stress, sleep hours, and daily
                activities for the best AI analysis results.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={resetForm}>
            Reset to Default
          </Button>
          <Button onClick={handleSendEmail}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Test Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
