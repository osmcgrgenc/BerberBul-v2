import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full py-4 px-8 bg-white shadow-md flex justify-between items-center">
      <div className="text-2xl font-bold text-indigo-600">BerberBul</div>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link prefetch={false} href="/auth/login" className="text-gray-700 hover:text-indigo-600">
              Giriş Yap
            </Link>
          </li>
          <li>
            <Link prefetch={false} href="/auth/register" className="text-gray-700 hover:text-indigo-600">
              Kayıt Ol
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
