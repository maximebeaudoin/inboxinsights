import { Geist } from 'next/font/google';

import { Analytics } from '@vercel/analytics/next';
import { ThemeProvider } from 'next-themes';

import MainNav from '@/components/main-nav';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Toaster } from '@/components/ui/toaster';

import { createClient } from '@/utils/supabase/server';

import './globals.css';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'InboxInsights: AI-Powered Mood Analytics Through Email',
  description: 'InboxInsights: Transform your emotional well-being through intelligent email-based mood tracking and AI-powered insights.',
};

const geistSans = Geist({
  display: 'swap',
  subsets: ['latin'],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-5 items-center">
              {user && <MainNav user={user} />}
              <div className="flex flex-col gap-20 max-w-5xl pt-5">{children}</div>

              {user && (
                <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-6">
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
                  <ThemeSwitcher />
                </footer>
              )}
            </div>
          </main>
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
