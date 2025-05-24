import Link from 'next/link';

import HeaderAuth from '@/components/header-auth';

import { createClient } from '@/utils/supabase/server';

export default async function MainNav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Don't show navigation if user is not signed in
  if (!user) {
    return null;
  }

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href={'/'}>InboxInsights</Link>
          <Link href={'/dashboard/mood-meter'} className="text-sm font-normal hover:underline">
            Mood Meter
          </Link>
        </div>
        <HeaderAuth />
      </div>
    </nav>
  );
}
