import { UserCircle } from 'lucide-react';

export function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm flex-shrink-0">
      <div className="text-xl font-semibold text-slate-800">
        Painel de Controle
      </div>
      <div className="flex items-center space-x-4">
        <button className="flex items-center text-slate-600 hover:text-slate-900 transition-colors">
          <UserCircle size={28} className="mr-2 text-slate-400" />
          <div className="flex flex-col items-start leading-tight">
             <span className="font-medium text-sm text-slate-700">Gestor</span>
             <span className="text-xs text-slate-500">LogiTrack Admin</span>
          </div>
        </button>
      </div>
    </header>
  );
}
