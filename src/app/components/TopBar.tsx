import { Search, Bell, User } from "lucide-react";
import { Input } from "./ui/input";

export function TopBar() {
  return (
    <header className="h-20 bg-white/70 backdrop-blur-md border-b border-neutral-200/50 flex items-center justify-between px-8 shadow-sm">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <Input
            type="search"
            placeholder="Search applications..."
            className="pl-12 bg-white border-neutral-200 rounded-full h-12 shadow-sm hover:shadow-md transition-shadow"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-yellow-100 transition-all duration-200 relative group">
          <Bell className="w-5 h-5 text-neutral-600 group-hover:text-yellow-600 transition-colors" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-orange-500 rounded-full ring-2 ring-white"></span>
        </button>
        <button className="w-11 h-11 flex items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-teal-500 hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-200">
          <User className="w-5 h-5 text-white" />
        </button>
      </div>
    </header>
  );
}