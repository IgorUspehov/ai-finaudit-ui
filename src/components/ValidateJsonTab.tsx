import { useState } from 'react';
import { Code2, CheckCircle, XCircle, Play } from 'lucide-react';
import { API_BASE_URL } from '../config';

interface ValidationResult {
  valid: boolean;
  message?: string;
  details?: unknown;
}

export default function ValidateJsonTab() {
  const [json, setJson] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [parseError, setParseError] = useState('');

  const handleValidate = async () => {
    setParseError('');
    setResult(null);

    let parsed: unknown;
    try {
      parsed = JSON.parse(json);
    } catch {
      setParseError('Invalid JSON syntax — please check your input.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });
      const data: ValidationResult = await res.json();
      setResult(data);
    } catch {
      setResult({ valid: false, message: 'Could not reach API server. Is it running on localhost:8001?' });
    } finally {
      setLoading(false);
    }
  };

  const isJsonValid = (() => {
    if (!json.trim()) return null;
    try { JSON.parse(json); return true; } catch { return false; }
  })();

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2.5">
        <Code2 size={18} className="text-green-400" />
        <h2 className="text-white font-semibold text-lg">Validate JSON</h2>
      </div>

      <p className="text-gray-500 text-sm">
        Paste raw invoice JSON to validate it against the schema and compliance rules.
      </p>

      <div className="relative">
        <textarea
          value={json}
          onChange={(e) => { setJson(e.target.value); setParseError(''); setResult(null); }}
          placeholder={'{\n  "vendor_name": "Mustermann GmbH",\n  "invoice_number": "RE-2024-001",\n  ...\n}'}
          spellCheck={false}
          rows={12}
          className={`w-full font-mono text-sm bg-gray-800 text-gray-200 rounded-xl border px-4 py-3.5 resize-none outline-none transition-colors placeholder:text-gray-600
            ${parseError
              ? 'border-red-500/50 focus:border-red-500'
              : isJsonValid === true
              ? 'border-green-500/40 focus:border-green-500/60'
              : 'border-gray-700 focus:border-gray-600'
            }`}
        />
        {json.trim() && (
          <div className="absolute top-3 right-3">
            {isJsonValid === true ? (
              <span className="flex items-center gap-1 text-green-400 text-xs bg-gray-900/80 px-2 py-0.5 rounded-full border border-green-500/30">
                <CheckCircle size={10} /> Valid JSON
              </span>
            ) : (
              <span className="flex items-center gap-1 text-red-400 text-xs bg-gray-900/80 px-2 py-0.5 rounded-full border border-red-500/30">
                <XCircle size={10} /> Syntax error
              </span>
            )}
          </div>
        )}
      </div>

      {parseError && (
        <p className="flex items-center gap-2 text-red-400 text-sm">
          <XCircle size={14} /> {parseError}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={handleValidate}
          disabled={!json.trim() || loading || isJsonValid === false}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200
            ${!json.trim() || loading || isJsonValid === false
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-400 text-gray-900 shadow-lg shadow-green-500/20 active:scale-[0.98]'
            }`}
        >
          <Play size={14} className={loading ? 'animate-pulse' : ''} />
          {loading ? 'Validating...' : 'Validate'}
        </button>
        {json.trim() && (
          <button
            onClick={() => { setJson(''); setResult(null); setParseError(''); }}
            className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {result && (
        <div
          className={`rounded-xl border p-4 transition-all ${
            result.valid
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {result.valid ? (
              <CheckCircle size={16} className="text-green-400" />
            ) : (
              <XCircle size={16} className="text-red-400" />
            )}
            <span className={`font-semibold text-sm ${result.valid ? 'text-green-400' : 'text-red-400'}`}>
              {result.valid ? 'Validation passed' : 'Validation failed'}
            </span>
          </div>
          {result.message && (
            <p className={`text-sm ${result.valid ? 'text-green-300/80' : 'text-red-300/80'}`}>
              {result.message}
            </p>
          )}
          {result.details && (
            <pre className="mt-3 text-xs font-mono text-gray-400 bg-gray-900/60 rounded-lg p-3 overflow-x-auto">
              {JSON.stringify(result.details, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
