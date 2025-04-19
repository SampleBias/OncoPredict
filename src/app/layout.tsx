import type {Metadata} from 'next';
import {Figtree} from 'next/font/google';
import './globals.css';

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
});

export const metadata: Metadata = {
  title: 'OncoPredict',
  description: 'AI-powered cancer prediction tool',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={figtree.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

