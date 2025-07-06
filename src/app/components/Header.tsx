"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

type UserRole = "barber" | "customer" | null;

export default function Header() {
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

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
  }, []);

  return (
    <header className="w-full py-4 px-8 bg-white shadow-md flex justify-between items-center">
      <div className="text-2xl font-bold text-indigo-600">BerberBul</div>
      {!loading && (
        <nav>
          <ul className="flex space-x-4">
            {role === "barber" && (
              <>
                <li>
                  <Link href="/barber/dashboard" className="text-gray-700 hover:text-indigo-600">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/barber/dashboard/appointments" className="text-gray-700 hover:text-indigo-600">
                    Randevular
                  </Link>
                </li>
              </>
            )}
            {role === "customer" && (
              <>
                <li>
                  <Link href="/customer/dashboard/find-barber" className="text-gray-700 hover:text-indigo-600">
                    Berber Ara
                  </Link>
                </li>
                <li>
                  <Link href="/customer/dashboard" className="text-gray-700 hover:text-indigo-600">
                    Profil
                  </Link>
                </li>
              </>
            )}
            {role === null && (
              <>
                <li>
                  <Link href="/auth/login" className="text-gray-700 hover:text-indigo-600">
                    Giriş Yap
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="text-gray-700 hover:text-indigo-600">
                    Kayıt Ol
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
