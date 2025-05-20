import type { Metadata } from 'next';
import './globals.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';


export const metadata: Metadata = {
  title: 'News Portal',
  description: 'A modern news portal built with Next.js and Django',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        
        {/* Main content area */}
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}