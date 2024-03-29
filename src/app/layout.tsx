import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { SnackbarProvider } from '@/context/snackbar-context';

const poppins = Poppins({ weight: ['400', '800', '200'], subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Jezzter',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <SnackbarProvider>{children}</SnackbarProvider>
      </body>
    </html>
  );
}
