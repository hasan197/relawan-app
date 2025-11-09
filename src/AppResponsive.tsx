import { useState, useEffect } from 'react';
import App from './App';
import AppDesktop from './AppDesktop';

const AppResponsive = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024); // lg breakpoint
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return isDesktop ? <AppDesktop /> : <App />;
};

export default AppResponsive;