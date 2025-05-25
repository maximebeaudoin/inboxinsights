'use client';

import { User } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { APP_CONFIG } from '@/lib/config';

interface DemoCredentialsButtonProps {
  onPopulateCredentials: (email: string, password: string) => void;
  className?: string;
}

export function DemoCredentialsButton({
  onPopulateCredentials,
  className = '',
}: DemoCredentialsButtonProps) {
  const handleClick = () => {
    onPopulateCredentials(APP_CONFIG.demo.email, APP_CONFIG.demo.password);
  };

  return (
    <Button type="button" variant="outline" onClick={handleClick} className={`w-full ${className}`}>
      <User className="h-4 w-4 mr-2" />
      Use Demo Credentials
    </Button>
  );
}
