import Link from 'next/link';

import DeployButton from '@/components/deploy-button';
import { EnvVarWarning } from '@/components/env-var-warning';
import HeaderAuth from '@/components/header-auth';

import { hasEnvVars } from '@/utils/supabase/check-env-vars';

export default function MainNav() {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href={'/'}>InboxInsights</Link>
          <Link href={'/demo'} className="text-sm font-normal hover:underline">
            shadcn/ui Demo
          </Link>
        </div>
        <HeaderAuth />
      </div>
    </nav>
  );
}
