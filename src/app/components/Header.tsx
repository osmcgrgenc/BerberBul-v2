"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";
import { User } from "@supabase/supabase-js";
import { Bars3Icon, XMarkIcon, UserIcon, ScissorsIcon } from "@heroicons/react/24/outline";

type UserRole = "barber" | "customer" | null;

interface HeaderProps {
  user?: User | null;
}

export default function Header({ user }: HeaderProps) {
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      setRole(profile?.role ?? null);
      setLoading(false);
    };

    fetchRole();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      fetchRole();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setRole(null);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
        : 'bg-white shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <ScissorsIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:from-indigo-700 group-hover:to-purple-700 transition-all duration-200">
              BerberBul
            </span>
          </Link>

          {/* Desktop Navigation */}
          {!loading && (
            <nav className="hidden md:flex items-center space-x-8">
              {role === "barber" && (
                <>
                  <Link
                    href="/barber/dashboard"
                    className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 flex items-center space-x-1"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/barber/dashboard/appointments"
                    className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200"
                  >
                    Randevular
                  </Link>
                </>
              )}
              {role === "customer" && (
                <>
                  <Link
                    href="/customer/dashboard/find-barber"
                    className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200"
                  >
                    Berber Ara
                  </Link>
                  <Link
                    href="/customer/dashboard"
                    className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200"
                  >
                    Profil
                  </Link>
                </>
              )}
              {role === null && (
                <>
                  <Link
                    href="/auth/login"
                    className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200"
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/auth/register"
                    className="btn-primary"
                  >
                    Kayıt Ol
                  </Link>
                </>
              )}
              {user && (
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200"
                >
                  Çıkış Yap
                </button>
              )}
            </nav>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-indigo-600 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && !loading && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              {role === "barber" && (
                <>
                  <Link
                    href="/barber/dashboard"
                    className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 flex items-center space-x-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/barber/dashboard/appointments"
                    className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Randevular
                  </Link>
                </>
              )}
              {role === "customer" && (
                <>
                  <Link
                    href="/customer/dashboard/find-barber"
                    className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Berber Ara
                  </Link>
                  <Link
                    href="/customer/dashboard"
                    className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profil
                  </Link>
                </>
              )}
              {role === null && (
                <>
                  <Link
                    href="/auth/login"
                    className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/auth/register"
                    className="btn-primary text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Kayıt Ol
                  </Link>
                </>
              )}
              {user && (
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 text-left"
                >
                  Çıkış Yap
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
