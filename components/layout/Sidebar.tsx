
import React, { useContext, useEffect, useRef } from 'react';
import { Page, UserRole } from '../../types';
import { AuthContext } from '../../App';
import { ChartPieIcon, CalendarDaysIcon, DocumentPlusIcon, DocumentChartBarIcon, UsersIcon, Cog6ToothIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const navigation = [
  { name: Page.Dashboard, icon: ChartPieIcon, roles: [UserRole.Admin, UserRole.Cadastrador] },
  { name: Page.Appointments, icon: CalendarDaysIcon, roles: [UserRole.Admin, UserRole.Cadastrador] },
  { name: Page.NewAppointment, icon: DocumentPlusIcon, roles: [UserRole.Admin, UserRole.Cadastrador] },
  { name: Page.Reports, icon: DocumentChartBarIcon, roles: [UserRole.Admin] },
  { name: Page.Users, icon: UsersIcon, roles: [UserRole.Admin] },
  { name: Page.Settings, icon: Cog6ToothIcon, roles: [UserRole.Admin] },
];

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen, currentPage, setCurrentPage }) => {
  const authContext = useContext(AuthContext);
  const trigger = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target as Node) || trigger.current.contains(target as Node)) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  const userRole = authContext?.user?.role;

  return (
    <>
      {/* Sidebar backdrop */}
      <div
        className={`fixed inset-0 bg-gray-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      ></div>

      <div
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-auto no-scrollbar w-64 lg:w-20 lg:hover:w-64 shrink-0 bg-slate-800 p-4 transition-all duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-64'
        }`}
      >
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          <a href="#0" onClick={(e) => { e.preventDefault(); setCurrentPage(Page.Dashboard); }} className="flex items-center">
            <svg width="32" height="32" viewBox="0 0 32 32">
                <defs>
                    <linearGradient x1="28.538%" y1="20.229%" x2="100%" y2="108.156%" id="logo-a">
                        <stop stopColor="#fff" stopOpacity=".8" offset="0%"></stop>
                        <stop stopColor="#fff" offset="100%"></stop>
                    </linearGradient>
                    <linearGradient x1="88.638%" y1="29.267%" x2="22.42%" y2="100%" id="logo-b">
                        <stop stopColor="#38bdf8" stopOpacity="0" offset="0%"></stop>
                        <stop stopColor="#38bdf8" offset="100%"></stop>
                    </linearGradient>
                </defs>
                <rect fill="#0ea5e9" width="32" height="32" rx="16"></rect>
                <path d="M18.277.16C26.035 1.267 32 7.938 32 16c0 8.837-7.163 16-16 16A16 16 0 010 16C0 7.938 5.965 1.267 13.723.16c.784-.108 1.519.08 2.112.639.593.56 1.02 1.288 1.11 2.133l.623 5.854c.14 1.32.76 2.534 1.658 3.432.897.9 2.108 1.52 3.428 1.66l5.854.623c.845.09 1.573.517 2.133 1.11.56.593.747 1.328.64 2.112-.108.784-.39 1.519-.81 2.112a16 16 0 01-22.628-22.628c.593-.42 1.328-.702 2.112-.81.845-.09 1.573.18 2.133.747l.01.01z" fill="url(#logo-a)"></path>
                <path d="M13.823 28.192c-1.32-.14-2.534-.76-3.432-1.658-.9-.897-1.52-2.108-1.66-3.428l-.623-5.854c-.09-.845-.517-1.573-1.11-2.133-.593-.56-1.328-.747-2.112-.64-.784.108-1.519.39-2.112.81a16 16 0 0022.628 22.628c.42-.593.702-1.328.81-2.112.09-.845-.18-1.573-.747-2.133l-.01-.01z" fill="url(#logo-b)"></path>
            </svg>
            <h1 className="text-2xl font-bold text-white ml-3 truncate lg:opacity-0 lg:group-hover:opacity-100 duration-200">CRAS Web</h1>
          </a>
        </div>
        
        <nav className="space-y-2">
          {navigation.map((item) => (
            userRole && item.roles.includes(userRole) && (
              <a
                key={item.name}
                href="#0"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(item.name);
                  setSidebarOpen(false);
                }}
                className={`flex items-center p-2 rounded-lg text-gray-300 hover:bg-slate-700 hover:text-white transition-colors duration-200 ${currentPage === item.name ? 'bg-sky-600 text-white' : ''}`}
              >
                <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                <span className="ml-3 truncate lg:opacity-0 lg:group-hover:opacity-100 duration-200">{item.name}</span>
              </a>
            )
          ))}
        </nav>
        
        <div className="mt-auto">
             <a
                href="#0"
                onClick={(e) => {
                  e.preventDefault();
                  authContext?.logout();
                }}
                className="flex items-center p-2 rounded-lg text-gray-300 hover:bg-slate-700 hover:text-white transition-colors duration-200"
              >
                <ArrowLeftOnRectangleIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                <span className="ml-3 truncate lg:opacity-0 lg:group-hover:opacity-100 duration-200">Sair</span>
              </a>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
