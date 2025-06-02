"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { Menu, X, UserCircle, ChevronDown } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close user dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const linkClasses = (path) =>
    `px-3 py-2 rounded-md text-sm font-medium transition ${
      pathname === path
        ? "bg-teal-600 text-white"
        : "text-gray-800 hover:bg-gray-100"
    }`;

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-1">
              <span className="text-2xl font-bold text-teal-600 tracking-tight">
                x<span className="text-gray-800">eno</span>
              </span>
              <span className="text-xl font-semibold text-gray-800">
                _minCRM
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link href="/" className={linkClasses("/")}>
              Home
            </Link>
            {session && (
              <>
                <Link href="/create-segment" className={linkClasses("/create-segment")}>
                  Make Segment
                </Link>
                <Link href="/create" className={linkClasses("/create")}>
                  Send Campaign
                </Link>
                <Link href="/history" className={linkClasses("/history")}>
                  History
                </Link>
              </>
            )}
          </div>

          {/* User / Auth Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {session ? (
              <div
                className="relative flex items-center space-x-2"
                ref={userMenuRef}
              >
                {/* Display user name in smaller text */}
                {session.user.name && (
                  <span className="text-gray-800 text-sm font-medium truncate max-w-xs">
                    {session.user.name}
                  </span>
                )}
                <button
                  onClick={() => setUserDropdownOpen((open) => !open)}
                  className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle className="w-8 h-8 text-gray-600" />
                  )}
                  <ChevronDown
                    className={`w-4 h-4 text-gray-600 transition-transform ${
                      userDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-md overflow-hidden">
                    <Link
                      href="/profile"
                      className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-3 py-2 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="bg-teal-600 text-white px-3 py-1 rounded-md hover:bg-teal-700 transition text-sm font-medium"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileOpen((open) => !open)}
              className="p-2 rounded-md hover:bg-gray-100 transition"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-6 h-6 text-gray-800" />
              ) : (
                <Menu className="w-6 h-6 text-gray-800" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-md">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {session && session.user.name && (
              <div className="px-3 py-2 text-gray-800 text-sm font-medium truncate">
                {session.user.name}
              </div>
            )}
            <Link
              href="/"
              className={`block ${linkClasses("/")}`}
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            {session && (
              <>
                <Link
                  href="/create"
                  className={`block ${linkClasses("/create")}`}
                  onClick={() => setMobileOpen(false)}
                >
                  Create
                </Link>
                <Link
                  href="/history"
                  className={`block ${linkClasses("/history")}`}
                  onClick={() => setMobileOpen(false)}
                >
                  History
                </Link>
              </>
            )}
            {session ? (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  signOut();
                }}
                className="w-full text-left px-3 py-2 text-gray-800 hover:bg-gray-100 rounded-md transition text-sm font-medium"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  signIn("google");
                }}
                className="w-full text-left px-3 py-2 text-gray-800 hover:bg-gray-100 rounded-md transition text-sm font-medium"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
