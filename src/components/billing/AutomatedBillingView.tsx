import React, { useState } from 'react';
import { 
  Receipt, 
  DollarSign, 
  CreditCard, 
  Plus, 
  RefreshCw, 
  Download, 
  CheckCircle2, 
  Printer, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  Coffee,
  X,
  Building
} from 'lucide-react';
import { FolioItem, Room, Guest, ChargeCategory } from '../../types/hotel';

interface AutomatedBillingViewProps {
  folios: FolioItem[];
  rooms: Room[];
  guests: Guest[];
  onAddCharge: (newItem: Omit<FolioItem, 'id' | 'timestamp'>) => void;
  onSettleFolio: (roomNumber: string, paymentMethod: string) => void;
  onTriggerNightAudit: () => void;
  onLogAuditEvent: (actionType: any, details: string, severity?: any) => void;
}

export const AutomatedBillingView: React.FC<AutomatedBillingViewProps> = ({
  folios,
  rooms,
  guests,
  onAddCharge,
  onSettleFolio,
  onTriggerNightAudit,
  onLogAuditEvent,
}) => {
  const [selectedRoomNumber, setSelectedRoomNumber] = useState<string>('101');
  const [isAddChargeModalOpen, setIsAddChargeModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isNightAuditSuccessModalOpen, setIsNightAuditSuccessModalOpen] = useState(false);

  // Form states for posting charge
  const [chargeCategory, setChargeCategory] = useState<ChargeCategory>('Dining & Minibar');
  const [chargeDescription, setChargeDescription] = useState('Artisanal Rooftop Cocktails');
  const [chargeAmount, setChargeAmount] = useState('45.00');

  // Checkout payment method
  const [selectedPaymentGateway, setSelectedPaymentGateway] = useState('Stripe Terminal (Instant 3D-Secure)');

  // Group folios by room number
  const occupiedRooms = rooms.filter(r => r.status === 'Occupied');
  const roomsWithFolios = Array.from(new Set(folios.map(f => f.roomNumber)));

  const currentRoomFolios = folios.filter(f => f.roomNumber === selectedRoomNumber);
  const currentRoom = rooms.find(r => r.roomNumber === selectedRoomNumber);
  const currentGuest = guests.find(g => g.id === currentRoom?.guestId) || guests.find(g => g.name === currentRoom?.guestName);

  const totalFolioBalance = currentRoomFolios
    .filter(f => f.status === 'Posted')
    .reduce((acc, f) => acc + f.amount, 0);

  const totalSettledAmount = currentRoomFolios
    .filter(f => f.status === 'Settled')
    .reduce((acc, f) => acc + f.amount, 0);

  const totalPropertyOutstanding = folios
    .filter(f => f.status === 'Posted')
    .reduce((acc, f) => acc + f.amount, 0);

  const handlePostChargeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRoom) return;
    const amountNum = parseFloat(chargeAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    onAddCharge({
      guestId: currentRoom.guestId || 'guest-anon',
      roomNumber: selectedRoomNumber,
      category: chargeCategory,
      description: chargeDescription,
      amount: amountNum,
      status: 'Posted'
    });

    onLogAuditEvent(
      'FOLIO_ADJUSTMENT',
      `Posted ${chargeCategory} of $${amountNum.toFixed(2)} to Room ${selectedRoomNumber} (${chargeDescription}).`,
      'INFO'
    );

    setIsAddChargeModalOpen(false);
    setChargeAmount('45.00');
  };

  const handleRunNightAudit = () => {
    onTriggerNightAudit();
    setIsNightAuditSuccessModalOpen(true);
  };

  const handleConfirmCheckoutSettlement = () => {
    onSettleFolio(selectedRoomNumber, selectedPaymentGateway);
    onLogAuditEvent(
      'FOLIO_ADJUSTMENT',
      `Settled outstanding balance of $${totalFolioBalance.toFixed(2)} for Room ${selectedRoomNumber} via ${selectedPaymentGateway}.`,
      'INFO'
    );
    setIsCheckoutModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Editorial Title & Overview */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Automated Billing & Folio Settlement
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Automated night audit reconciliation, multi-category folio ledger, and instant payment gateway settlement.
          </p>
        </div>

        {/* Night Audit & Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRunNightAudit}
            className="px-3.5 py-2 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-emerald-400/20 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Execute Night Audit Run</span>
          </button>
        </div>
      </div>

      {/* Financial Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Outstanding Folios</span>
            <Receipt className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums">
            ${totalPropertyOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            <span>Unbilled in-house charges</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Selected Room Due</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono tabular-nums">
            ${totalFolioBalance.toFixed(2)}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            <span>Room {selectedRoomNumber} · {currentGuest?.name || 'In-House Guest'}</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Payment Gateways</span>
            <CreditCard className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-sm font-bold text-slate-100 mt-1">
            Stripe & Adyen Active
          </div>
          <div className="text-xs text-slate-400 mt-2">
            <span>PCI-DSS Level 1 Encrypted</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Night Audit Schedule</span>
            <Clock className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-sm font-bold text-slate-100 mt-1">
            02:00 UTC Batch Auto-Post
          </div>
          <div className="text-xs text-slate-400 mt-2">
            <span>Automated VAT & Room balancing</span>
          </div>
        </div>
      </div>

      {/* Main Folio Management Layout: Room Selector Sidebar + Itemized Folio Table */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Room Folio Selector */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-semibold text-slate-300">
              In-House Folio Accounts
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              {occupiedRooms.length} Active
            </span>
          </div>

          <div className="space-y-1.5 max-h-[520px] overflow-y-auto">
            {occupiedRooms.map(room => {
              const roomBalance = folios
                .filter(f => f.roomNumber === room.roomNumber && f.status === 'Posted')
                .reduce((acc, f) => acc + f.amount, 0);

              const isSelected = selectedRoomNumber === room.roomNumber;

              return (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoomNumber(room.roomNumber)}
                  className={`w-full text-left p-3 rounded-lg transition-colors cursor-pointer border ${
                    isSelected
                      ? 'bg-slate-800 border-amber-400/60 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-slate-100">
                      Room {room.roomNumber}
                    </span>
                    <span className="font-mono text-xs font-semibold text-amber-400 tabular-nums">
                      ${roomBalance.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 font-medium truncate mt-0.5">
                    {room.guestName || 'In-House'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                    <span>{room.category}</span>
                    <span>Departs: {room.checkOut?.substring(5)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column (3 spans): Selected Room Itemized Folio & Billing Console */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            {/* Folio Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold font-mono text-slate-100">
                    Folio Account: Room {selectedRoomNumber}
                  </h2>
                  <span className="text-xs text-slate-400">
                    Guest: <strong className="text-slate-200">{currentGuest?.name || currentRoom?.guestName || 'In-House'}</strong>
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Card on File: <span className="font-mono">{currentGuest?.maskedCreditCard || 'Pre-authorized Terminal Card'}</span> · Stay: {currentRoom?.checkIn} to {currentRoom?.checkOut}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddChargeModalOpen(true)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Post Charge</span>
                </button>
                <button
                  onClick={() => setIsCheckoutModalOpen(true)}
                  disabled={totalFolioBalance <= 0}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                    totalFolioBalance > 0
                      ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Settle Folio (${totalFolioBalance.toFixed(2)})</span>
                </button>
              </div>
            </div>

            {/* Folio Items Table */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {currentRoomFolios.map(item => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-3 text-slate-400 tabular-nums">
                        {item.timestamp}
                      </td>
                      <td className="py-3 px-3 text-slate-300 font-sans">
                        {item.category}
                      </td>
                      <td className="py-3 px-3 text-slate-200 font-sans">
                        {item.description}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-100 tabular-nums">
                        ${item.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className={`text-[11px] font-sans font-semibold px-2 py-0.5 rounded ${
                          item.status === 'Settled'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                            : 'bg-amber-950/60 text-amber-400 border border-amber-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {currentRoomFolios.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 font-sans text-xs">
                        No folio charges currently posted for this room.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Folio Summary Totals */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-slate-400 block">Total Posted Charges</span>
                  <span className="font-mono text-sm font-semibold text-slate-200 tabular-nums">
                    ${(totalFolioBalance + totalSettledAmount).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Already Settled</span>
                  <span className="font-mono text-sm font-semibold text-emerald-400 tabular-nums">
                    ${totalSettledAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-slate-400 block">Net Outstanding Balance Due</span>
                <span className="font-mono text-xl font-bold text-amber-400 tabular-nums">
                  ${totalFolioBalance.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Charge Modal */}
      {isAddChargeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <form
            onSubmit={handlePostChargeSubmit}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100">
                Post Ancillary Charge: Room {selectedRoomNumber}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddChargeModalOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Charge Category
              </label>
              <select
                value={chargeCategory}
                onChange={(e) => setChargeCategory(e.target.value as ChargeCategory)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
              >
                <option value="Dining & Minibar">Dining & Minibar</option>
                <option value="Spa & Wellness">Spa & Wellness</option>
                <option value="Late Checkout">Late Checkout Fee</option>
                <option value="Resort Fee">Resort & Facility Fee</option>
                <option value="Room Charge">Room Charge Adjustment</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Description / Line Item
              </label>
              <input
                type="text"
                value={chargeDescription}
                onChange={(e) => setChargeDescription(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Amount (USD)
              </label>
              <input
                type="number"
                step="0.01"
                value={chargeAmount}
                onChange={(e) => setChargeAmount(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAddChargeModalOpen(false)}
                className="px-3.5 py-2 text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
              >
                Post Charge to Folio
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Settle / Checkout Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  Folio Settlement & Invoice Dispatch
                </h3>
                <p className="text-xs text-slate-400">
                  Room {selectedRoomNumber} · Guest: {currentGuest?.name || 'In-House Guest'}
                </p>
              </div>
              <button
                onClick={() => setIsCheckoutModalOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-xl space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Total Balance Outstanding:</span>
                <span className="font-mono font-bold text-amber-400 text-base">
                  ${totalFolioBalance.toFixed(2)}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Includes all room charges, taxes, dining, and spa amenities.
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Select Payment Processing Gateway:
              </label>
              <div className="space-y-2 text-xs">
                {[
                  'Stripe Terminal (Instant 3D-Secure)',
                  'Adyen Global Settlement (Card on file)',
                  'Direct Apple Pay / NFC Terminal',
                  'Cash / Wire Settlement'
                ].map(gateway => (
                  <label
                    key={gateway}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedPaymentGateway === gateway
                        ? 'bg-amber-400/10 border-amber-400 text-slate-100'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_gateway"
                      checked={selectedPaymentGateway === gateway}
                      onChange={() => setSelectedPaymentGateway(gateway)}
                      className="text-amber-400 focus:ring-0"
                    />
                    <span>{gateway}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 text-xs text-slate-300 hover:text-slate-100 flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice Statement</span>
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsCheckoutModalOpen(false)}
                  className="px-3.5 py-2 text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmCheckoutSettlement}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
                >
                  Confirm Payment (${totalFolioBalance.toFixed(2)})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Night Audit Completion Modal */}
      {isNightAuditSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  Night Audit Batch Executed
                </h3>
                <p className="text-xs text-slate-400">
                  Daily financial close reconciled successfully.
                </p>
              </div>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-lg text-xs text-slate-300 space-y-1 font-mono">
              <div className="flex justify-between">
                <span>Rooms Posted:</span>
                <span className="text-emerald-400 font-bold">{occupiedRooms.length} rooms</span>
              </div>
              <div className="flex justify-between">
                <span>Tourism VAT Computed:</span>
                <span className="text-slate-200">$480.00</span>
              </div>
              <div className="flex justify-between">
                <span>Ledger Balance:</span>
                <span className="text-emerald-400 font-bold">BALANCED (0.00 variance)</span>
              </div>
              <div className="flex justify-between">
                <span>Audit Log Hash:</span>
                <span className="text-slate-400 text-[10px]">sha256:44aa0182...</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsNightAuditSuccessModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
