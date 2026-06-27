import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Download any social media video',
  description: 'Download any social media video - Built with Rust + Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
