import type { Metadata } from 'next';
import './globals.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CategoryHorizontalWrapper from './components/layout/CategoryHorizontalWrapper';
import NavigationProgress from './components/loading/NavigationProgress';




export const metadata: Metadata = {
  title: 'Rolpa Online',
  description: 'A modern news portal built with Next.js and Django',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative">
        <NavigationProgress />
        <Header />
        <div className="top-[72px] bg-white  z-40">
  <CategoryHorizontalWrapper />
</div>
        
        {/* Main content area */}
        <main>
          
          {children}</main>
        <Footer />
      </body>
    </html>
  );
}