export interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface InvoiceResult {
  vendor_name: string;
  invoice_number: string;
  invoice_date: string;
  line_items: LineItem[];
  netto: number;
  mwst_rate: number;
  mwst_amount: number;
  brutto: number;
  iban?: string;
  compliant: boolean;
  error_message?: string;
}
