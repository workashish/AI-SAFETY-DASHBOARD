import { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import '../styles/DashboardLayout.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 992);

      if (window.innerWidth < 992) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };


    checkScreenSize();


    window.addEventListener('resize', checkScreenSize);


    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  const handleMainContentClick = () => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Header />
      <div className="dashboard-content">
        <Sidebar className={isSidebarOpen ? 'open' : ''} />
        <main
          className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
          onClick={handleMainContentClick}
        >
          {isMobile && (
            <button
              className="sidebar-toggle"
              onClick={(e) => {
                e.stopPropagation();
                toggleSidebar();
              }}
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </button>
          )}
          <div className="content-wrapper">
            {children}
          </div>
        </main>
      </div>


      {isMobile && isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default DashboardLayout;
