'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { AlertTriangle, Check, Eye, EyeOff, Lock, Mail, UserPlus, X } from 'lucide-react';

import { FormMessage, Message } from '@/components/form-message';
import { PrivacyContentNotice } from '@/components/privacy-content-notice';
import { SubmitButton } from '@/components/submit-button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { signUpAction } from '@/app/actions';

interface PasswordValidation {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export default function Signup() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showValidation, setShowValidation] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Password validation function
  const validatePassword = (password: string): PasswordValidation => {
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  const passwordValidation = validatePassword(password);
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

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
        {/* Privacy & Content Policy */}
        <PrivacyContentNotice />

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
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setShowValidation(true)}
                      required
                      className={`pr-10 transition-all focus:ring-2 focus:ring-primary/20 ${
                        showValidation && password.length > 0
                          ? isPasswordValid
                            ? 'border-green-500 focus:border-green-500'
                            : 'border-red-500 focus:border-red-500'
                          : ''
                      }`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>

                  {/* Password Validation Feedback */}
                  {showValidation && password.length > 0 && (
                    <div className="space-y-2 p-3 bg-muted/30 rounded-lg border">
                      <p className="text-xs font-medium text-muted-foreground">
                        Password requirements:
                      </p>
                      <div className="grid grid-cols-1 gap-1 text-xs">
                        <div
                          className={`flex items-center gap-2 ${
                            passwordValidation.minLength ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {passwordValidation.minLength ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                          At least 8 characters
                        </div>
                        <div
                          className={`flex items-center gap-2 ${
                            passwordValidation.hasUppercase ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {passwordValidation.hasUppercase ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                          One uppercase letter
                        </div>
                        <div
                          className={`flex items-center gap-2 ${
                            passwordValidation.hasLowercase ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {passwordValidation.hasLowercase ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                          One lowercase letter
                        </div>
                        <div
                          className={`flex items-center gap-2 ${
                            passwordValidation.hasNumber ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {passwordValidation.hasNumber ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                          One number
                        </div>
                        <div
                          className={`flex items-center gap-2 ${
                            passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {passwordValidation.hasSpecialChar ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                          One special character (!@#$%^&*(),.?":{}|&lt;&gt;)
                        </div>
                      </div>
                      {isPasswordValid && (
                        <div className="flex items-center gap-2 text-green-600 font-medium">
                          <Check className="h-3 w-3" />
                          Password meets all requirements!
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <SubmitButton
                  pendingText="Signing up..."
                  formAction={signUpAction}
                  className="w-full mt-6"
                  disabled={!isPasswordValid || !email.trim()}
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
