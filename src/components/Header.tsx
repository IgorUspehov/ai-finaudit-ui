import { ShieldCheck, Cpu, Globe } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/20">
            <Cpu size={22} className="text-gray-900" />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl tracking-tight leading-none">
              AI-FinAudit Hub
            </h1>
            <p className="text-gray-400 text-xs mt-0.5">German Invoice Processing Platform</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-green-500" />
            GDPR-compliant
          </span>
          <span className="hidden sm:block w-px h-3 bg-gray-700" />
          <span className="flex items-center gap-1.5">
            <Cpu size={13} className="text-green-500" />
            Local AI
          </span>
          <span className="hidden sm:block w-px h-3 bg-gray-700" />
          <span className="flex items-center gap-1.5">
            <Globe size={13} className="text-green-500" />
            German Invoice Processing
          </span>
        </div>
      </div>
    </header>
  );
}
