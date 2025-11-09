
import React, { useContext } from 'react';
import { AuthContext } from '../../App';
import { Page } from '../../types';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentPage: Page;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen, currentPage }) => {
  const authContext = useContext(AuthContext);

  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 -mb-px">
          {/* Header: Left side */}
          <div className="flex">
            {/* Hamburger button */}
            <button
              className="text-gray-500 hover:text-gray-600 lg:hidden"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span className="sr-only">Open sidebar</span>
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="5" width="16" height="2" />
                <rect x="4" y="11" width="16" height="2" />
                <rect x="4" y="17" width="16" height="2" />
              </svg>
            </button>
             <h1 className="text-2xl font-semibold text-gray-800 ml-4 lg:ml-0">{currentPage}</h1>
          </div>

          {/* Header: Right side */}
          <div className="flex items-center">
            <div className="relative inline-flex">
              <div className="flex items-center space-x-4">
                 <div className="text-right">
                    <div className="font-semibold text-gray-700">{authContext?.user?.name}</div>
                    <div className="text-xs text-gray-500">{authContext?.user?.role}</div>
                </div>
                <div className="h-10 w-10 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold">
                  {authContext?.user?.name.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
