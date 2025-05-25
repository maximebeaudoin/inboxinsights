import Link from 'next/link';

import { HelpCircle } from 'lucide-react';

import HeaderAuth from '@/components/header-auth';
import { InstructionsSheet } from '@/components/instructions-sheet';
import { Button } from '@/components/ui/button';

export default function MainNav() {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href={'/dashboard/mood-meter'}>InboxInsights - Mood Meter</Link>
        </div>
        <div className="flex items-center gap-4">
          <InstructionsSheet>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Help
            </Button>
          </InstructionsSheet>
          <HeaderAuth />
        </div>
      </div>
    </nav>
  );
}
