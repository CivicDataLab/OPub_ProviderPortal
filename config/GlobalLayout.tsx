import React, { useState } from 'react';
import { Navbar } from 'components/common';
import AccessibilityNav from 'components/common/AccessibilityBar/AccessibilityNav';
import { Footer } from 'components/common';
import { navList } from 'config/navigation';

const GlobalLayout: React.FC = ({ children }) => {
  return (
    <>
      <div>
        <header className="header-freeze">
          <AccessibilityNav />
          <Navbar data={navList} />
        </header>
        <div id="main">{children}</div>
        <Footer />
      </div>
    </>
  );
};

export default GlobalLayout;
