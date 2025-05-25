'use client';

import { useState } from 'react';

import Link from 'next/link';

import type { User } from '@supabase/supabase-js';

import { BarChart3, HelpCircle, Menu, X } from 'lucide-react';

import { InstructionsSheet } from '@/components/instructions-sheet';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { signOutAction } from '@/app/actions';

interface MainNavProps {
  user: User | null;
}

export default function MainNav({ user }: MainNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4">
        {/* Mobile Menu Button */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <MobileNav />
          </SheetContent>
        </Sheet>

        {/* Desktop Brand */}
        <div className="mr-4 hidden md:flex">
          <Link href="/dashboard/mood-meter" className="mr-6 flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">InboxInsights</span>
          </Link>
        </div>

        {/* Mobile Brand */}
        <div className="flex md:hidden">
          <Link href="/dashboard/mood-meter" className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="font-bold">InboxInsights</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="hidden items-center space-x-2 md:flex">
            <InstructionsSheet>
              <Button variant="ghost" size="sm">
                <HelpCircle className="h-4 w-4" />
                <span className="sr-only">Help</span>
              </Button>
            </InstructionsSheet>
            <ThemeSwitcher />
          </nav>
          <ClientHeaderAuth user={user} />
        </div>
      </div>
    </nav>
  );
}

function MobileNav() {
  return (
    <div className="flex flex-col space-y-3">
      <SheetHeader>
        <SheetTitle className="flex items-center space-x-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <span>InboxInsights</span>
        </SheetTitle>
        <SheetDescription>Navigate through your mood tracking dashboard</SheetDescription>
      </SheetHeader>

      <div className="flex flex-col space-y-4 pt-4">
        {/* Navigation Links */}
        <Link
          href="/dashboard/mood-meter"
          className="flex items-center space-x-2 text-lg font-medium"
        >
          <BarChart3 className="h-5 w-5" />
          <span>Mood Meter</span>
        </Link>

        {/* Mobile Navigation Actions */}
        <div className="flex flex-col space-y-3 pt-4 border-t">
          <InstructionsSheet>
            <Button variant="ghost" className="justify-start" size="sm">
              <HelpCircle className="mr-2 h-4 w-4" />
              Help & Instructions
            </Button>
          </InstructionsSheet>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Theme</span>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
}

function ClientHeaderAuth({ user }: { user: User | null }) {
  return user ? (
    <div className="flex items-center gap-4">
      <span className="hidden sm:inline">Hey, {user.email}!</span>
      <form action={signOutAction}>
        <Button type="submit" variant="outline" size="sm">
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant="outline">
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant="default" className="hidden">
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
