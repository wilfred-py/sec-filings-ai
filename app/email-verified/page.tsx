"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Email Verified - tldrSEC",
  description: "Your email has been verified",
};

export default function EmailVerifiedPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login after 3 seconds
    const timer = setTimeout(() => {
      router.push("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center space-y-4 p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold">Email Verified!</h1>
        <p>Your email has been successfully verified.</p>
        <p className="text-sm text-gray-500">
          Redirecting to login in 3 seconds...
        </p>
        <Link
          href="/login"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Continue to Login
        </Link>
      </div>
    </div>
  );
}
