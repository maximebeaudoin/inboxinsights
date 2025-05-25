'use client';

import { HelpCircle } from 'lucide-react';

import { InstructionsSheet } from '@/components/instructions-sheet';
import { Button } from '@/components/ui/button';

export function FloatingHelpButton() {

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <InstructionsSheet>
        <Button
          size="lg"
          variant="secondary"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <HelpCircle className="h-6 w-6" />
          <span className="sr-only">Help and instructions</span>
        </Button>
      </InstructionsSheet>
    </div>
  );
}
