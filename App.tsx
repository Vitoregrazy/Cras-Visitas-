
import React, { useState, useMemo, useCallback } from 'react';
import { Page, User, UserRole } from './types';
import { mockApi } from './services/api';
import Layout from './components/layout/Layout';
import Dashboard from './components/pages/Dashboard';
import Appointments from './components/pages/Appointments';
import NewAppointment from './components/pages/NewAppointment';
import Reports from './components/pages/Reports';
import Users from './components/pages/Users';
import Settings from './components/pages/Settings';
import Login from './components/pages/Login';

// Initialize with some data if it's the first run
mockApi.initializeData();

export const AuthContext = React.createContext<{
  user: User | null;
  login: (email: string, pass: string) => Promise<User | null>;
  logout: () => void;
} | null>(null);


const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(mockApi.getCurrentUser());
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);

  const login = useCallback(async (email: string, pass: string) => {
    const loggedInUser = await mockApi.login(email, pass);
    setUser(loggedInUser);
    setCurrentPage(Page.Dashboard);
    return loggedInUser;
  }, []);

  const logout = useCallback(() => {
    mockApi.logout();
    setUser(null);
  }, []);

  const authContextValue = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Dashboard:
        return <Dashboard />;
      case Page.Appointments:
        return <Appointments />;
      case Page.NewAppointment:
        return <NewAppointment setCurrentPage={setCurrentPage} />;
      case Page.Reports:
        return <Reports />;
      case Page.Users:
        // Admin only page
        if (user?.role === UserRole.Admin) {
          return <Users />;
        }
        return <div className="p-8">Acesso não autorizado.</div>;
      case Page.Settings:
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  if (!user) {
    return (
      <AuthContext.Provider value={authContextValue}>
        <Login />
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      <div className="bg-gray-100 min-h-screen">
        <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
          {renderPage()}
        </Layout>
      </div>
    </AuthContext.Provider>
  );
};

export default App;
