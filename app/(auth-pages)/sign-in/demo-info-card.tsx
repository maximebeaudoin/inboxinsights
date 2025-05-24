'use client';

import { useState } from 'react';

import { Check, Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useToast } from '@/hooks/use-toast';

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: 'Copied!',
        description: `${label} copied to clipboard`,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: 'Failed to copy',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button
      type="button"
      size="icon"
      variant="outline"
      onClick={handleCopy}
      className="h-8 w-8 shrink-0"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}

export function DemoInfoCard() {
  return (
    <Card className="bg-muted/30 border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-lg">Demo Account Information</CardTitle>
        <CardDescription>
          Use these predefined credentials for testing, or send data to the email below
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="demo-email">Demo Email</Label>
          <div className="flex gap-2">
            <Input id="demo-email" value="demo@example.com" disabled className="flex-1" />
            <CopyButton text="demo@example.com" label="Demo email" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="demo-password">Demo Password</Label>
          <div className="flex gap-2">
            <Input
              id="demo-password"
              type="password"
              value="demopassword123"
              disabled
              className="flex-1"
            />
            <CopyButton text="demopassword123" label="Demo password" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="data-email">Send Data To</Label>
          <div className="flex gap-2">
            <Input
              id="data-email"
              value="b82ba9d30ef2dd7cf65016dfe8c69b37@inbound.postmarkapp.com"
              disabled
              className="flex-1 text-xs"
            />
            <CopyButton
              text="b82ba9d30ef2dd7cf65016dfe8c69b37@inbound.postmarkapp.com"
              label="Data email"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Send your data to this email address for processing
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
