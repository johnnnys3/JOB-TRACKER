import { Link, useLocation } from "react-router";
import { LayoutDashboard, FileText, BarChart3, Settings, ChevronLeft, ChevronRight, Briefcase } from "lucide-react";
import { cn } from "./ui/utils";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Applications", path: "/applications", icon: FileText },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
  { name: "Settings", path: "/settings", icon: Settings },
];

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "bg-white/80 backdrop-blur-sm border-r border-neutral-200/50 flex flex-col transition-all duration-300 relative z-20 shadow-xl",
        collapsed ? "w-20" : "w-72"
      )}
    >
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-neutral-200/50">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl text-neutral-900">JobTracker</span>
              <p className="text-xs text-neutral-500">Track your career</p>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== "/" && location.pathname.startsWith(item.path));
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-teal-400 to-teal-500 text-white shadow-lg shadow-teal-500/30"
                      : "text-neutral-600 hover:bg-neutral-100"
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="font-medium">{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Toggle Button */}
      <div className="p-4 border-t border-neutral-200/50">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center px-4 py-3 rounded-2xl text-neutral-600 hover:bg-neutral-100 transition-all duration-200"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="ml-3 font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}