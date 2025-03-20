"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LuSun, LuMoon } from "react-icons/lu";
import { getSession } from "@/lib/session-client";
import { IUser } from "@/app/models/User";
import { logout } from "@/app/actions/log-out";

interface NavItem {
  href: string;
  icon: React.FC<{ className?: string }>;
  label: string;
}

const navItems: NavItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<IUser | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const { user } = await getSession();
        setUser(user);
        const savedDarkMode = localStorage.getItem("darkMode") === "true";
        setDarkMode(savedDarkMode);
        document.documentElement.classList.toggle("dark", savedDarkMode);
      } catch (error) {
        console.error("Error initializing session:", error);
        setError("Failed to load session");
      }
    };
    initialize();
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
    document.documentElement.classList.toggle("dark");
  };

  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="flex h-screen w-64 flex-col justify-between bg-white p-4 dark:bg-gray-800">
      <div>
        <div className="mb-8 flex items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            tldrSEC
          </h1>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 ${
                pathname === item.href ? "bg-gray-100 dark:bg-gray-700" : ""
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="space-y-4">
        {user && (
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user.oauthProfiles?.[0]?.displayName ?? "User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <LuSun className="h-5 w-5" />
            ) : (
              <LuMoon className="h-5 w-5" />
            )}
          </button>
          <Button variant="ghost" size="icon" onClick={logout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
