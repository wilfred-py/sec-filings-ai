"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loadingButton";
import Link from "next/link";
import { LuLock, LuSun, LuMoon } from "react-icons/lu";
import { FiGithub } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaXTwitter } from "react-icons/fa6";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus(""); // Clear any previous status
    setIsLoggingIn(true); // Start loading
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
    document.documentElement.classList.toggle("dark");
  };

  const handleOAuthSignIn = async (provider: string) => {
    router.push(`/login/${provider}`);
  };

  useEffect(() => {
    // Check if dark mode preference exists in localStorage
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <div className="min-h-screen">
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 relative">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/30 dark:bg-black/50"></div>

        <div className="relative">
          <div className="container mx-auto px-4 py-8 flex flex-col min-h-screen">
            <header className="flex justify-between items-center mb-12 max-w-6xl mx-auto w-full">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                tldrSEC
              </h1>
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
            </header>
            <main className="flex-grow flex flex-col items-center justify-center">
              <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Login to Your Account
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500"
                    />
                  </div>
                  <LoadingButton
                    loading={isLoggingIn}
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <LuLock className="mr-2 h-4 w-4" />
                    Login
                  </LoadingButton>
                </form>
                {submitStatus && (
                  <p
                    className={`mt-4 text-sm ${submitStatus.includes("successful") ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                  >
                    {submitStatus}
                  </p>
                )}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm mt-6">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400"></span>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleOAuthSignIn("github")}
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <FiGithub className="h-5 w-5" />
                    <span className="sr-only">Sign up with GitHub</span>
                  </button>
                  <button
                    onClick={() => handleOAuthSignIn("google")}
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <FcGoogle className="h-5 w-5" />
                    <span className="sr-only">Sign up with Gmail</span>
                  </button>
                  <button
                    onClick={() => handleOAuthSignIn("x")}
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <FaXTwitter className="h-5 w-5" />
                    <span className="sr-only">Sign up with X</span>
                  </button>
                </div>
                <div className="mt-6 text-center">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/sign-up"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
