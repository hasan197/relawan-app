import { ReactNode } from 'react';
import { DesktopSidebar } from './DesktopSidebar';

interface DesktopLayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function DesktopLayout({ children, currentPage, onNavigate }: DesktopLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DesktopSidebar currentPage={currentPage} onNavigate={onNavigate} />
      <div className="flex-1 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
