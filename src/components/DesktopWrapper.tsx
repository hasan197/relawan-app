import { ReactNode } from 'react';

interface DesktopWrapperProps {
  children: ReactNode;
}

export function DesktopWrapper({ children }: DesktopWrapperProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Desktop Container */}
      <div className="mx-auto max-w-md bg-white min-h-screen shadow-2xl relative">
        {children}
        
        {/* Desktop Info Bar */}
        <div className="hidden lg:block fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full text-xs shadow-lg z-50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Desktop View - Mobile Preview (428px)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
