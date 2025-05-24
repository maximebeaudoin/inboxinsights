import Link from 'next/link';

import { AlertTriangle, Lock, Mail } from 'lucide-react';

import { FormMessage, Message } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { signInAction } from '@/app/actions';

import { DemoInfoCard } from './demo-info-card';

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background to-muted/20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-6xl w-full">
        {/* Sign-in Form */}
        <div className="flex flex-col space-y-6">
          {/* Privacy Disclaimer */}
          <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-amber-800 dark:text-amber-200">Privacy Notice</AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-300">
              <strong>Important:</strong> Some user data will be publicly visible, including your
              email address, name, and email content. This is a public demo application.
            </AlertDescription>
          </Alert>

          {/* Sign-in Card */}
          <Card className="shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Lock className="h-6 w-6 text-primary" />
                Sign in
              </CardTitle>
              <CardDescription>
                Don't have an account?{' '}
                <Link
                  className="text-primary font-medium underline hover:no-underline"
                  href="/sign-up"
                >
                  Sign up
                </Link>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Password
                    </Label>
                    <Link
                      className="text-xs text-muted-foreground hover:text-primary underline"
                      href="/forgot-password"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Your password"
                    required
                    className="transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <SubmitButton
                  pendingText="Signing In..."
                  formAction={signInAction}
                  className="w-full mt-6"
                >
                  Sign in
                </SubmitButton>
                <FormMessage message={searchParams} />
              </form>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground border-t pt-6">
            <p>
              Created with love by{' '}
              <a
                href="https://github.com/maximebeaudoin"
                target="_blank"
                className="font-medium hover:text-primary transition-colors"
                rel="noreferrer"
              >
                Maxime Beaudoin
              </a>
            </p>
          </div>
        </div>

        {/* Demo Info Card */}
        <div className="flex flex-col">
          <DemoInfoCard />
        </div>
      </div>
    </div>
  );
}
