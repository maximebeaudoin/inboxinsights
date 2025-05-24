'use client';

import { useState } from 'react';

import { ExternalLink, Info, Key, Mail, Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useToast } from '@/hooks/use-toast';

function ClickableInput({
  value,
  label,
  id,
  type = 'text',
  className = '',
}: {
  value: string;
  label: string;
  id: string;
  type?: string;
  className?: string;
}) {
  const { toast } = useToast();

  const handleClick = async (e: React.MouseEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    input.select();

    try {
      await navigator.clipboard.writeText(value);
      toast({
        title: 'Copied!',
        description: `${label} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: 'Failed to copy',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  return (
    <Input
      id={id}
      type={type}
      value={value}
      readOnly
      onClick={handleClick}
      className={`cursor-pointer ${className}`}
    />
  );
}

export function DemoInfoCard() {
  return (
    <Card className="shadow-lg border-muted/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          Demo Account Information
        </CardTitle>
        <CardDescription>
          Use these predefined credentials for testing, or send data to the email below
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Demo Credentials Section */}
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
            <Key className="h-4 w-4" />
            Demo Credentials
          </h3>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="demo-email" className="flex items-center gap-2 text-xs">
                <Mail className="h-3 w-3" />
                Demo Email
              </Label>
              <ClickableInput
                id="demo-email"
                value="demo@example.com"
                label="Demo email"
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="demo-password" className="flex items-center gap-2 text-xs">
                <Key className="h-3 w-3" />
                Demo Password
              </Label>
              <ClickableInput
                id="demo-password"
                type="password"
                value="demopassword123"
                label="Demo password"
                className="text-sm"
              />
            </div>
          </div>
        </div>

        {/* Data Ingestion Section */}
        <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Send className="h-4 w-4" />
            Data Ingestion
          </h3>

          <div className="space-y-2">
            <Label htmlFor="data-email" className="flex items-center gap-2 text-xs">
              <Mail className="h-3 w-3" />
              Send Data To
            </Label>
            <ClickableInput
              id="data-email"
              value="b82ba9d30ef2dd7cf65016dfe8c69b37@inbound.postmarkapp.com"
              label="Data email"
              className="text-xs"
            />
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Send your data to this email address for processing
            </p>
          </div>
        </div>

        {/* GitHub Repository Section */}
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
            <ExternalLink className="h-4 w-4" />
            GitHub Repository
          </h3>

          <div className="space-y-2">
            <Label htmlFor="github-repo" className="flex items-center gap-2 text-xs">
              <ExternalLink className="h-3 w-3" />
              Repository URL
            </Label>
            <div className="flex gap-2">
              <ClickableInput
                id="github-repo"
                value="https://github.com/maximebeaudoin/inboxinsights"
                label="GitHub repository URL"
                className="flex-1 text-xs"
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() =>
                  window.open('https://github.com/maximebeaudoin/inboxinsights', '_blank')
                }
                className="h-8 w-8 shrink-0 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              View the source code and contribute to the project
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
