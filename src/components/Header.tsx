// src/components/Header.tsx
import React from 'react';
import Link from 'next/link';

interface NavLinkItem {
  href: string;
  text: string;
}

interface HeaderProps {
  navLinks?: NavLinkItem[];
}

const Header: React.FC<HeaderProps> = ({ navLinks }) => {
  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          TattooRemovalNear.com
        </Link>
        {navLinks && navLinks.length > 0 && (
          <div>
            {navLinks.map((link, index) => (
              <Link key={index} href={link.href} className="text-indigo-600 hover:text-indigo-800 ml-4">
                {link.text}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
