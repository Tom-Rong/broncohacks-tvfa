'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  
  const links = [
    { href: '/', label: 'Dashboard' },
    { href: '/my-notes', label: 'My Notes' },
    { href: '/generate', label: 'Generate Notes' },
    { href: '/lectures', label: 'Lecture Library' },
  ];

  return (
    <nav className="bg-indigo-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📝</span>
            <span className="font-bold text-xl">NoteAI</span>
          </div>
          <div className="flex gap-1">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-indigo-900 text-white'
                    : 'hover:bg-indigo-600 text-indigo-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
