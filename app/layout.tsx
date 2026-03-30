import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dobly | Founding Member Waitlist',
  description:
    'Describe any repetitive task in plain English. Dobly designs the full workflow in 10 seconds and runs it forever.',
  metadataBase: new URL('https://dobly.io')
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
