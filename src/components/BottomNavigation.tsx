import { Home, Users, BarChart3, User } from "lucide-react";

type NavItem = "dashboard" | "donatur" | "laporan" | "profil";

interface BottomNavigationProps {
  active: NavItem;
  onNavigate?: (item: NavItem) => void;
}

export function BottomNavigation({
  active,
  onNavigate,
}: BottomNavigationProps) {
  const navItems = [
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
                  isActive ? "bg-primary-100" : "bg-transparent"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    isActive
                      ? "text-primary-600"
                      : "text-gray-400"
                  }`}
                />
              </div>
              <span
                className={`text-xs ${isActive ? "text-primary-600" : "text-gray-500"}`}
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