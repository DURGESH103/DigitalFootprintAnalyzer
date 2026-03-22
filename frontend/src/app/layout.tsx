import type { Metadata, Viewport } from 'next';
import { Toaster } from 'react-hot-toast';
import { NetworkStatus } from '@/components/ui/NetworkStatus';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Digital Footprint Analyzer',
    template: '%s | Digital Footprint Analyzer',
  },
  description: 'AI-powered GitHub profile analysis. Discover your developer personality, coding patterns, strengths, and actionable insights.',
  keywords: ['GitHub analytics', 'developer insights', 'AI code analysis', 'hireability score', 'coding personality'],
  authors: [{ name: 'Digital Footprint Analyzer' }],
  openGraph: {
    type: 'website',
    title: 'Digital Footprint Analyzer',
    description: 'AI-powered GitHub profile analysis and developer insights',
    siteName: 'Digital Footprint Analyzer',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Footprint Analyzer',
    description: 'AI-powered GitHub profile analysis and developer insights',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0d1117',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <NetworkStatus />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1c2128',
              color: '#e6edf3',
              border: '1px solid #30363d',
              borderRadius: '10px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#3fb950', secondary: '#0d1117' } },
            error: { iconTheme: { primary: '#f78166', secondary: '#0d1117' } },
          }}
        />
      </body>
    </html>
  );
}
