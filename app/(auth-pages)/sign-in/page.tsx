import Link from 'next/link';

import { FormMessage, Message } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { signInAction } from '@/app/actions';

import { DemoInfoCard } from './demo-info-card';

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-6xl w-full">
        {/* Sign-in Form */}
        <div className="flex flex-col min-w-64">
          <form className="flex flex-col">
            <h1 className="text-2xl font-medium">Sign in</h1>
            <p className="text-sm text-foreground">
              Don't have an account?{' '}
              <Link className="text-foreground font-medium underline" href="/sign-up">
                Sign up
              </Link>
            </p>
            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
              <Label htmlFor="email">Email</Label>
              <Input name="email" placeholder="you@example.com" required />
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link className="text-xs text-foreground underline" href="/forgot-password">
                  Forgot Password?
                </Link>
              </div>
              <Input type="password" name="password" placeholder="Your password" required />
              <SubmitButton pendingText="Signing In..." formAction={signInAction}>
                Sign in
              </SubmitButton>
              <FormMessage message={searchParams} />

              <div className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-6">
                <p>
                  Created with love by{' '}
                  <a
                    href="https://github.com/maximebeaudoin"
                    target="_blank"
                    className="font-bold hover:underline"
                    rel="noreferrer"
                  >
                    Maxime Beaudoin
                  </a>
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Demo Info Card */}
        <div className="flex flex-col">
          <DemoInfoCard />
        </div>
      </div>
    </div>
  );
}
