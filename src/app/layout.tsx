import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { WalletProvider } from '@/context/WalletProvider';
import Header from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'DecentraX',
  description: 'Decentralized Crowdfunding Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased'
        )}
      >
        <WalletProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </WalletProvider>
      </body>
    </html>
  );
}
