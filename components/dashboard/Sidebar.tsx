"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LuSun, LuMoon } from "react-icons/lu";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
  });
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
    document.documentElement.classList.toggle("dark");
  };

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
        <div className="flex items-center space-x-4">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
          </div>
        </div>
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
          <Button variant="ghost" size="icon">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
