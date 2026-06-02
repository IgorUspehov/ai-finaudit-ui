import { useCallback, useState } from 'react';
import { Upload, FileText, Loader2, Cpu } from 'lucide-react';
import { API_BASE_URL } from '../config';
import type { InvoiceResult } from '../types';

interface Props {
  onResult: (result: InvoiceResult) => void;
  onError: (msg: string) => void;
}

export default function UploadSection({ onResult, onError }: Props) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === 'application/pdf') {
      setFile(dropped);
    } else {
      onError('Only PDF files are supported.');
    }
  }, [onError]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected?.type === 'application/pdf') {
      setFile(selected);
    } else if (selected) {
      onError('Only PDF files are supported.');
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    setLoading(true);
    onError('');
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`${API_BASE_URL}/process-invoice`, {
        method: 'POST',
        body: form,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || `HTTP ${res.status}`);
      }
      const data: InvoiceResult = await res.json();
      onResult(data);
    } catch (err: unknown) {
      onError(err instanceof Error ? err.message : 'Failed to process invoice.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h2 className="text-white font-semibold text-lg mb-4">Upload Invoice</h2>

      <label
        htmlFor="pdf-input"
        className={`relative flex flex-col items-center justify-center gap-3 h-44 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200
          ${dragging
            ? 'border-green-400 bg-green-500/10'
            : file
            ? 'border-green-600 bg-green-500/5'
            : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800'
          }`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <input
          id="pdf-input"
          type="file"
          accept="application/pdf"
          className="sr-only"
          onChange={handleFileChange}
        />

        {file ? (
          <>
            <div className="w-11 h-11 rounded-xl bg-green-500/15 flex items-center justify-center">
              <FileText size={22} className="text-green-400" />
            </div>
            <div className="text-center">
              <p className="text-green-400 font-medium text-sm">{file.name}</p>
              <p className="text-gray-500 text-xs mt-0.5">{(file.size / 1024).toFixed(1)} KB · PDF</p>
            </div>
            <p className="text-gray-500 text-xs">Click to replace</p>
          </>
        ) : (
          <>
            <div className="w-11 h-11 rounded-xl bg-gray-700 flex items-center justify-center">
              <Upload size={22} className="text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-gray-300 font-medium text-sm">
                {dragging ? 'Drop PDF here' : 'Drag & drop PDF'}
              </p>
              <p className="text-gray-500 text-xs mt-0.5">or click to browse</p>
            </div>
            <p className="text-gray-600 text-xs">Supports: PDF · Max 50 MB</p>
          </>
        )}
      </label>

      <button
        onClick={handleProcess}
        disabled={!file || loading}
        className={`mt-4 w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-semibold text-sm transition-all duration-200
          ${!file || loading
            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
            : 'bg-green-500 hover:bg-green-400 text-gray-900 shadow-lg shadow-green-500/20 hover:shadow-green-400/30 active:scale-[0.98]'
          }`}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Analyzing with local AI...
          </>
        ) : (
          <>
            <Cpu size={16} />
            Process Invoice
          </>
        )}
      </button>
    </div>
  );
}
