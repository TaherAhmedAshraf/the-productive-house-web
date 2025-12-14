import './globals.css';
import type { Metadata } from 'next';
import { Lato, Libre_Baskerville } from 'next/font/google';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import CartToast from './components/CartToast';

const lato = Lato({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-lato',
});

const libreBaskerville = Libre_Baskerville({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'Productivity Method - Premium Planners & Productivity Tools',
  description: 'Transform your productivity with our beautifully designed planners and tools. Over 150,000 planners sold.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${lato.variable} ${libreBaskerville.variable} font-sans`}>
        <AuthProvider>
          <CartProvider>
            {children}
            <CartToast />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
