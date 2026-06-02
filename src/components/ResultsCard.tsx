import { CheckCircle, XCircle, Building2, Hash, Calendar, CreditCard, TrendingUp } from 'lucide-react';
import type { InvoiceResult } from '../types';

interface Props {
  result: InvoiceResult;
}

const EUR = (n: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(n);

function InfoItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-800/60 border border-gray-700/50">
      <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={15} className="text-green-400" />
      </div>
      <div>
        <p className="text-gray-500 text-xs">{label}</p>
        <p className="text-white font-medium text-sm mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function ResultsCard({ result }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      {/* Card header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div>
          <h2 className="text-white font-semibold text-lg">Invoice Analysis</h2>
          <p className="text-gray-500 text-xs mt-0.5">Processed by local AI model</p>
        </div>
        {result.compliant ? (
          <span className="flex items-center gap-1.5 bg-green-500/15 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-full text-xs font-semibold">
            <CheckCircle size={13} />
            Compliant
          </span>
        ) : (
          <span className="flex items-center gap-1.5 bg-red-500/15 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-full text-xs font-semibold">
            <XCircle size={13} />
            Error
          </span>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Error message */}
        {!result.compliant && result.error_message && (
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/25 rounded-xl p-4">
            <XCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{result.error_message}</p>
          </div>
        )}

        {/* Invoice meta */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <InfoItem icon={Building2} label="Vendor" value={result.vendor_name || '—'} />
          <InfoItem icon={Hash} label="Invoice No." value={result.invoice_number || '—'} />
          <InfoItem icon={Calendar} label="Date" value={result.invoice_date || '—'} />
        </div>

        {/* Line items table */}
        {result.line_items?.length > 0 && (
          <div>
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Line Items</h3>
            <div className="rounded-xl border border-gray-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-800/70 border-b border-gray-700">
                    <th className="text-left text-gray-400 font-medium px-4 py-2.5 text-xs">Description</th>
                    <th className="text-right text-gray-400 font-medium px-4 py-2.5 text-xs">Qty</th>
                    <th className="text-right text-gray-400 font-medium px-4 py-2.5 text-xs">Unit Price</th>
                    <th className="text-right text-gray-400 font-medium px-4 py-2.5 text-xs">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {result.line_items.map((item, i) => (
                    <tr
                      key={i}
                      className={`border-b border-gray-800/60 transition-colors hover:bg-gray-800/30 ${
                        i === result.line_items.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <td className="text-gray-200 px-4 py-3">{item.description}</td>
                      <td className="text-gray-400 px-4 py-3 text-right tabular-nums">{item.quantity}</td>
                      <td className="text-gray-400 px-4 py-3 text-right tabular-nums">{EUR(item.unit_price)}</td>
                      <td className="text-white font-medium px-4 py-3 text-right tabular-nums">{EUR(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Financial summary */}
        <div>
          <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Financial Summary</h3>
          <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl overflow-hidden">
            <div className="divide-y divide-gray-700/50">
              <SummaryRow label="Netto" value={EUR(result.netto)} />
              <SummaryRow label={`MwSt. (${result.mwst_rate}%)`} value={EUR(result.mwst_amount)} />
              <SummaryRow label="Brutto" value={EUR(result.brutto)} highlight />
            </div>
          </div>
        </div>

        {/* IBAN */}
        {result.iban && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-800/40 border border-gray-700/50">
            <div className="w-9 h-9 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
              <CreditCard size={16} className="text-green-400" />
            </div>
            <div>
              <p className="text-gray-500 text-xs">IBAN</p>
              <p className="text-white font-mono font-medium text-sm mt-0.5 tracking-wider">{result.iban}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-4 py-3 ${highlight ? 'bg-green-500/8' : ''}`}>
      <span className={`text-sm ${highlight ? 'text-white font-semibold' : 'text-gray-400'}`}>
        {highlight && <TrendingUp size={13} className="inline mr-1.5 text-green-400" />}
        {label}
      </span>
      <span className={`font-mono font-semibold text-sm ${highlight ? 'text-green-400 text-base' : 'text-gray-200'}`}>
        {value}
      </span>
    </div>
  );
}
