import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PetCare AI - Vet Bill Analyzer',
  description: 'Validate veterinary costs with crowdsourced regional data',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
