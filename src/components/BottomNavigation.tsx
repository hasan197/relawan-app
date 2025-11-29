import { Home, Users, BarChart3, User, Shield, CheckCircle, Database } from "lucide-react";
import { useAppContext } from "../contexts/AppContext";

type NavItem = "dashboard" | "donatur" | "laporan" | "profil" | "admin-dashboard" | "admin-validasi-donasi" | "admin-data" | "admin-tools";

interface BottomNavigationProps {
  active: NavItem;
  onNavigate?: (item: NavItem) => void;
}

export function BottomNavigation({
  active,
  onNavigate,
}: BottomNavigationProps) {
  const { user } = useAppContext();
  
  // Admin Navigation
  const adminNavItems = [
    {
      id: "admin-dashboard" as NavItem,
      label: "Dashboard",
      icon: Shield,
    },
    { 
      id: "admin-validasi-donasi" as NavItem, 
      label: "Validasi", 
      icon: CheckCircle 
    },
    {
      id: "admin-data" as NavItem,
      label: "Data",
      icon: Database,
    },
    { 
      id: "profil" as NavItem, 
      label: "Profil", 
      icon: User 
    },
  ];

  // Regular User Navigation (Relawan & Pembimbing)
  const regularNavItems = [
    {
      id: "dashboard" as NavItem,
      label: "Dashboard",
      icon: Home,
    },
    { id: "donatur" as NavItem, label: "Donatur", icon: Users },
    {
      id: "laporan" as NavItem,
      label: "Laporan",
      icon: BarChart3,
    },
    { id: "profil" as NavItem, label: "Profil", icon: User },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : regularNavItems;

  const isAdminMode = user?.role === 'admin';

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-1.5 safe-area-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              className="flex flex-col items-center gap-0.5 py-1 px-3 min-w-[64px]"
            >
              <div
                className={`p-1.5 rounded-full transition-colors ${
                  isActive 
                    ? isAdminMode 
                      ? "bg-purple-100" 
                      : "bg-primary-100" 
                    : "bg-transparent"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    isActive
                      ? isAdminMode 
                        ? "text-purple-600" 
                        : "text-primary-600"
                      : "text-gray-400"
                  }`}
                />
              </div>
              <span
                className={`text-xs ${
                  isActive 
                    ? isAdminMode 
                      ? "text-purple-600" 
                      : "text-primary-600" 
                    : "text-gray-500"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}