'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { AlertTriangle, Lock, Mail, UserPlus } from 'lucide-react';

import { FormMessage, Message } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { signUpAction } from '@/app/actions';

export default function Signup() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  // Handle message display case
  if (message && 'message' in message) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background to-muted/20">
        <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
          <FormMessage message={message} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background to-muted/20">
      <div className="flex flex-col gap-6 w-full max-w-md">
        {/* Privacy Disclaimer */}
        <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="text-amber-800 dark:text-amber-200">Privacy Notice</AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-300">
            <strong>Important:</strong> Some user data will be publicly visible, including your
            email address, name, and email content. This is a public demo application.
          </AlertDescription>
        </Alert>

        {/* Sign-up Form */}
        <div className="flex flex-col space-y-6">
          {/* Sign-up Card */}
          <Card className="shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <UserPlus className="h-6 w-6 text-primary" />
                Sign up
              </CardTitle>
              <CardDescription>
                Already have an account?{' '}
                <Link
                  className="text-primary font-medium underline hover:no-underline"
                  href="/sign-in"
                >
                  Sign in
                </Link>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col space-y-4">
                {message && <FormMessage message={message} />}

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
                    minLength={6}
                    required
                    className="transition-all focus:ring-2 focus:ring-primary/20"
                  />
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 6 characters long
                  </p>
                </div>
                <SubmitButton
                  pendingText="Signing up..."
                  formAction={signUpAction}
                  className="w-full mt-6"
                >
                  Sign up
                </SubmitButton>
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
      </div>
    </div>
  );
}
