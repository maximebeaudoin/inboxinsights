'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { AlertTriangle, BookOpen, Lock, Mail } from 'lucide-react';

import { DataIngestionInfo } from '@/components/data-ingestion-info';
import { DemoCredentialsButton } from '@/components/demo-credentials-button';
import { FormMessage, Message } from '@/components/form-message';
import { InstructionsSheet } from '@/components/instructions-sheet';
import { PrivacyContentNotice } from '@/components/privacy-content-notice';
import { SubmitButton } from '@/components/submit-button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { signInAction } from '@/app/actions';

export default function Login() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handlePopulateCredentials = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  // Convert searchParams to Message format for FormMessage component
  const getFormMessage = (): Message | null => {
    if (searchParams.get('error')) {
      return { error: searchParams.get('error')! };
    }
    if (searchParams.get('success')) {
      return { success: searchParams.get('success')! };
    }
    if (searchParams.get('message')) {
      return { message: searchParams.get('message')! };
    }
    return null;
  };

  const message = getFormMessage();
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background to-muted/20">
      <div className="flex flex-col gap-6 max-w-6xl w-full">
        {/* Privacy & Content Policy */}
        <PrivacyContentNotice />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Sign-in Form */}
          <div className="flex flex-col space-y-6">
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>

                  <DemoCredentialsButton
                    onPopulateCredentials={handlePopulateCredentials}
                    className="mt-2"
                  />

                  {message && <FormMessage message={message} />}
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

          {/* Instructions Info */}
          <div className="flex flex-col space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Getting Started
                </CardTitle>
                <CardDescription>
                  New to InboxInsights? Learn how to track your mood and explore demo features.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <DataIngestionInfo variant="compact" showTitle={false} />

                <InstructionsSheet>
                  <Button className="w-full">
                    <BookOpen className="h-4 w-4 mr-2" />
                    View Complete Guide & Demo Info
                  </Button>
                </InstructionsSheet>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
