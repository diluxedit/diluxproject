import React, {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {BackToTopButton} from './BackToTopButton';
import {Footer} from './Footer';
import {Navbar} from './Navbar';

export function Layout({children}: {children: React.ReactNode}) {
  const {pathname} = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0F172A]">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <BackToTopButton />
    </div>
  );
}
