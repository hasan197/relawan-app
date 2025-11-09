import { ReactNode, useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { DesktopHeader } from './DesktopHeader';

type NavItem = 'dashboard' | 'donatur' | 'laporan' | 'profil' | 'template' | 'regu' | 'pengaturan';

interface DesktopLayoutProps {
  children: ReactNode;
  activeNav: NavItem;
  onNavigate?: (page: NavItem) => void;
  onNotificationClick?: () => void;
  onStatsClick?: () => void;
}

export function DesktopLayout({ 
  children, 
  activeNav, 
  onNavigate,
  onNotificationClick,
  onStatsClick
}: DesktopLayoutProps) {
  // Set sidebar to be open by default on desktop, closed on mobile
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the device is mobile on component mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div 
        className={`transition-all duration-300 ease-in-out ${
          sidebarOpen 
            ? 'w-64' 
            : isMobile 
              ? 'w-0' 
              : 'w-20'
        } ${isMobile ? 'fixed inset-y-0 left-0 z-30' : 'relative'}`}
      >
        <Sidebar 
          active={activeNav} 
          onNavigate={onNavigate} 
          isCollapsed={!sidebarOpen && !isMobile}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <DesktopHeader
          onNotificationClick={onNotificationClick}
          onStatsClick={onStatsClick}
          onMenuClick={toggleSidebar}
          onSearch={handleSearch}
          isSidebarOpen={sidebarOpen}
        />
        
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}