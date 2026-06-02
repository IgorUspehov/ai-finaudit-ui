import { useState } from 'react';
import { FileText, Code2, AlertCircle, X } from 'lucide-react';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import ResultsCard from './components/ResultsCard';
import ValidateJsonTab from './components/ValidateJsonTab';
import type { InvoiceResult } from './types';

type Tab = 'process' | 'validate';

export default function App() {
  const [tab, setTab] = useState<Tab>('process');
  const [result, setResult] = useState<InvoiceResult | null>(null);
  const [error, setError] = useState('');

  const handleResult = (r: InvoiceResult) => {
    setResult(r);
    setError('');
  };

  const handleError = (msg: string) => {
    setError(msg);
    if (msg) setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Tab switcher */}
        <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit mb-8">
          <TabButton
            active={tab === 'process'}
            onClick={() => setTab('process')}
            icon={<FileText size={14} />}
            label="Process Invoice"
          />
          <TabButton
            active={tab === 'validate'}
            onClick={() => setTab('validate')}
            icon={<Code2 size={14} />}
            label="Validate JSON"
          />
        </div>

        {/* Global error banner */}
        {error && (
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/25 rounded-xl p-4 mb-6">
            <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm flex-1">{error}</p>
            <button onClick={() => setError('')} className="text-red-400/60 hover:text-red-400 transition-colors">
              <X size={15} />
            </button>
          </div>
        )}

        {tab === 'process' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <UploadSection onResult={handleResult} onError={handleError} />

            {result ? (
              <ResultsCard result={result} />
            ) : (
              <EmptyResultsPlaceholder />
            )}
          </div>
        )}

        {tab === 'validate' && <ValidateJsonTab />}
      </main>

      <footer className="border-t border-gray-800 text-center py-4 text-gray-600 text-xs">
        AI-FinAudit Hub · GDPR-compliant local processing · No data leaves your infrastructure
      </footer>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150
        ${active
          ? 'bg-green-500 text-gray-900 shadow-sm'
          : 'text-gray-400 hover:text-gray-200'
        }`}
    >
      {icon}
      {label}
    </button>
  );
}

function EmptyResultsPlaceholder() {
  return (
    <div className="bg-gray-900 border border-gray-800 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 py-16 px-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-800 flex items-center justify-center">
        <FileText size={26} className="text-gray-600" />
      </div>
      <div>
        <p className="text-gray-400 font-medium">No results yet</p>
        <p className="text-gray-600 text-sm mt-1">Upload a PDF invoice and click "Process Invoice" to see the analysis here.</p>
      </div>
    </div>
  );
}
