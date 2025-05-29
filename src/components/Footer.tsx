// src/components/Footer.tsx
import React from 'react';

interface FooterProps {
  showDisclaimer?: boolean;
}

const Footer: React.FC<FooterProps> = ({ showDisclaimer = false }) => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-6 text-center">
        <p>&copy; {new Date().getFullYear()} TattooRemovalNear.com. All rights reserved.</p>
        {showDisclaimer && (
          <p className="text-sm text-gray-400 mt-2">
            Disclaimer: Information provided on this website is for general informational purposes only and does not constitute medical advice.
          </p>
        )}
      </div>
    </footer>
  );
};

export default Footer;
