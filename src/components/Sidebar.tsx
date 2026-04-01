import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Compass } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export function Sidebar() {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Viagens', path: '/viagens', icon: Compass },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full text-slate-300">
      <div className="h-16 flex items-center px-6 bg-slate-950 border-b border-slate-800 flex-shrink-0">
        <Compass className="text-brand-400 mr-2" size={24} />
        <span className="text-white font-bold text-xl tracking-wide">LogiTrack</span>
      </div>
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={twMerge(
                    "flex items-center px-6 py-3 hover:bg-slate-800 hover:text-white transition-colors duration-200",
                    isActive && "bg-brand-600/10 text-brand-400 border-r-4 border-brand-500"
                  )}
                >
                  <Icon size={20} className="mr-3" />
                  <span className="font-medium">{link.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-slate-800 text-sm text-slate-500 flex-shrink-0">
        &copy; 2026 LogiTrack Pro
      </div>
    </aside>
  );
}
