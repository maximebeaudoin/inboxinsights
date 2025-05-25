'use client';

import {
  AlertCircle,
  BarChart3,
  BookOpen,
  ExternalLink,
  Info,
  Mail,
  Send,
  TrendingUp,
  Users,
} from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { useToast } from '@/hooks/use-toast';

interface InstructionsSheetProps {
  children: React.ReactNode;
}

export function InstructionsSheet({ children }: InstructionsSheetProps) {
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

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-[600px] sm:w-[700px] sm:max-w-[700px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            How to Use InboxInsights
          </SheetTitle>
          <SheetDescription>
            Complete guide to tracking and analyzing your mood data
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Getting Started */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-500" />
              <h3 className="text-lg font-semibold">Getting Started</h3>
            </div>
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                InboxInsights is a mood tracking application that allows you to monitor your
                emotional well-being through data visualization. You can input mood data via email
                and view comprehensive analytics on your dashboard.
              </p>
              <div>
                <h4 className="font-medium mb-2">Key Features:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Email-based mood data ingestion</li>
                  <li>Interactive mood charts and trends</li>
                  <li>Personal and global mood views</li>
                  <li>Real-time dashboard updates</li>
                  <li>Mood statistics and insights</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How to Send Mood Data */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4 text-green-500" />
              <h3 className="text-lg font-semibold">How to Send Mood Data</h3>
            </div>
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                Send an email with your mood data in the subject line or body. The system will
                automatically process and categorize your mood information.
              </p>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-sm">Important Note</AlertTitle>
                <AlertDescription className="text-xs">
                  Make sure to send emails from the same email address you used to sign up for
                  accurate mood tracking.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {/* Dashboard Features */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-500" />
              <h3 className="text-lg font-semibold">Dashboard Features</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1">
                  <h4 className="font-medium flex items-center gap-2">
                    <TrendingUp className="h-3 w-3" />
                    Mood Trends Chart
                  </h4>
                  <p className="text-muted-foreground text-xs">
                    Visual representation of your mood patterns over time. Track your emotional
                    journey and identify trends.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-medium flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    View Modes
                  </h4>
                  <p className="text-muted-foreground text-xs">
                    Switch between personal view (your data only) and global view (all users'
                    anonymized data).
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-medium">Recent Mood Entries</h4>
                  <p className="text-muted-foreground text-xs">
                    Timeline view of your latest mood recordings with detailed insights and
                    AI-generated summaries.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-medium">Mood Statistics</h4>
                  <p className="text-muted-foreground text-xs">
                    Comprehensive statistics including average mood, mood distribution, and energy
                    levels over different time periods.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Account & Data Ingestion */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-orange-500" />
              <h3 className="text-lg font-semibold">Demo Account & Data Ingestion</h3>
            </div>

            {/* Demo Credentials */}
            <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
              <h4 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                <Info className="h-3 w-3" />
                Demo Credentials
              </h4>
              <p className="text-xs text-muted-foreground">
                Try the application with pre-populated demo data using these credentials:
              </p>
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Demo Email:</Label>
                  <Input
                    value="demo@example.com"
                    readOnly
                    className="text-xs h-8 cursor-pointer"
                    onClick={(e) => {
                      e.currentTarget.select();
                      handleCopy(e.currentTarget.value, 'Demo email');
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Demo Password:</Label>
                  <Input
                    type="password"
                    value="demopassword123"
                    readOnly
                    className="text-xs h-8 cursor-pointer"
                    onClick={(e) => {
                      e.currentTarget.select();
                      handleCopy(e.currentTarget.value, 'Demo password');
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Data Ingestion */}
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
                  value="b82ba9d30ef2dd7cf65016dfe8c69b37@inbound.postmarkapp.com"
                  readOnly
                  className="font-mono text-xs h-8 cursor-pointer"
                  onClick={(e) => {
                    e.currentTarget.select();
                    handleCopy(e.currentTarget.value, 'Data ingestion email');
                  }}
                />
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Send your mood data to this email address for automatic processing
                </p>
              </div>
            </div>

            {/* GitHub Repository */}
            <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
              <h4 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                <ExternalLink className="h-3 w-3" />
                GitHub Repository
              </h4>
              <div className="space-y-2">
                <Label className="text-xs font-medium flex items-center gap-2">
                  <ExternalLink className="h-3 w-3" />
                  Repository URL:
                </Label>
                <div className="flex gap-2">
                  <Input
                    value="https://github.com/maximebeaudoin/inboxinsights"
                    readOnly
                    className="flex-1 text-xs h-8 cursor-pointer"
                    onClick={(e) => {
                      e.currentTarget.select();
                      handleCopy(e.currentTarget.value, 'Repository URL');
                    }}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      window.open('https://github.com/maximebeaudoin/inboxinsights', '_blank')
                    }
                    className="h-8 w-8 shrink-0"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  View the source code and contribute to the project
                </p>
              </div>
            </div>
          </div>

          {/* Tips and Best Practices */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <h3 className="text-lg font-semibold">Tips and Best Practices</h3>
            </div>
            <div className="space-y-2 text-sm">
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1 text-xs">•</span>
                  <span className="text-xs">
                    Track your mood consistently for better insights and trend analysis
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1 text-xs">•</span>
                  <span className="text-xs">
                    Use descriptive language in your mood emails for more accurate AI analysis
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1 text-xs">•</span>
                  <span className="text-xs">
                    Check both personal and global views to understand your mood in context
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1 text-xs">•</span>
                  <span className="text-xs">
                    Review your mood patterns regularly to identify triggers and positive influences
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1 text-xs">•</span>
                  <span className="text-xs">
                    Use the dashboard insights to make informed decisions about your well-being
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
