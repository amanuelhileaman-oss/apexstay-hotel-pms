import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  KeyRound, 
  Sparkles, 
  CheckCircle2, 
  Coffee, 
  Thermometer, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Receipt, 
  Clock, 
  Bell, 
  User, 
  ChevronRight,
  Wifi,
  Wind,
  Check
} from 'lucide-react';
import { Room, Guest, FolioItem, RoomStatus } from '../../types/hotel';

interface MobileCompanionModalProps {
  initialMode: 'staff' | 'guest';
  initialRoomNumber?: string;
  rooms: Room[];
  guests: Guest[];
  folios: FolioItem[];
  onClose: () => void;
  onUpdateRoomStatus: (roomId: string, newStatus: RoomStatus, housekeeper?: string) => void;
  onToggleDoorLock: (roomId: string) => void;
  onAddFolioCharge: (charge: Omit<FolioItem, 'id' | 'timestamp'>) => void;
  onLogAuditEvent: (actionType: any, details: string, severity?: any) => void;
}

export const MobileCompanionModal: React.FC<MobileCompanionModalProps> = ({
  initialMode,
  initialRoomNumber,
  rooms,
  guests,
  folios,
  onClose,
  onUpdateRoomStatus,
  onToggleDoorLock,
  onAddFolioCharge,
  onLogAuditEvent,
}) => {
  const [mode, setMode] = useState<'staff' | 'guest'>(initialMode);
  
  // Guest view states
  const [activeGuestRoomNumber, setActiveGuestRoomNumber] = useState<string>(
    initialRoomNumber || '201'
  );
  const [keyNfcState, setKeyNfcState] = useState<'idle' | 'scanning' | 'unlocked'>('idle');
  const [guestTab, setGuestTab] = useState<'key' | 'services' | 'folio'>('key');
  const [serviceOrderFeedback, setServiceOrderFeedback] = useState<string | null>(null);

  // Staff view states
  const [staffTab, setStaffTab] = useState<'turnaround' | 'inspection' | 'arrivals'>('turnaround');
  const [selectedStaffRoomId, setSelectedStaffRoomId] = useState<string>('r-105');
  const [checklist, setChecklist] = useState({
    linen: true,
    amenities: false,
    minibar: false,
    acReset: true,
  });

  const activeGuestRoom = rooms.find(r => r.roomNumber === activeGuestRoomNumber) || rooms[0];
  const activeGuestFolios = folios.filter(f => f.roomNumber === activeGuestRoomNumber);
  const guestOutstandingBalance = activeGuestFolios
    .filter(f => f.status === 'Posted')
    .reduce((acc, f) => acc + f.amount, 0);

  const handleSimulateKeyTap = () => {
    setKeyNfcState('scanning');
    setTimeout(() => {
      setKeyNfcState('unlocked');
      onToggleDoorLock(activeGuestRoom.id);
      onLogAuditEvent(
        'MFA_CHALLENGE',
        `Guest NFC Digital Key credential validated for Room ${activeGuestRoomNumber}. Deadbolt released.`,
        'INFO'
      );
      setTimeout(() => {
        setKeyNfcState('idle');
      }, 2500);
    }, 1200);
  };

  const handleOrderService = (serviceName: string, amount: number) => {
    onAddFolioCharge({
      guestId: activeGuestRoom.guestId || 'guest-anon',
      roomNumber: activeGuestRoomNumber,
      category: 'Dining & Minibar',
      description: serviceName,
      amount,
      status: 'Posted'
    });

    setServiceOrderFeedback(`Ordered ${serviceName} ($${amount.toFixed(2)} posted to folio).`);
    setTimeout(() => setServiceOrderFeedback(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      {/* Smartphone Hardware Casing */}
      <div className="relative w-full max-w-[400px] h-[780px] bg-slate-950 rounded-[44px] border-[10px] border-slate-800 shadow-2xl flex flex-col overflow-hidden ring-1 ring-slate-700/60">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-full z-40 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800 mr-2" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400/80 animate-pulse" />
        </div>

        {/* Top Status Bar & Mode Switcher */}
        <div className="pt-8 px-5 pb-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between z-30">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setMode('staff')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                mode === 'staff' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Staff Portal
            </button>
            <button
              onClick={() => setMode('guest')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                mode === 'guest' ? 'bg-emerald-400 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Guest Key
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Screen Viewport */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-slate-950 text-slate-100">
          {mode === 'guest' ? (
            /* =================== GUEST MOBILE VIEW =================== */
            <div className="space-y-4 pb-16">
              {/* Hotel & Room Banner */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>ApexStay Luxury Cloud</span>
                  <span className="flex items-center gap-1 text-emerald-400 font-mono">
                    <Wifi className="w-3 h-3" /> Apex_Guest_5G
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold font-mono text-slate-100">
                      Room {activeGuestRoom.roomNumber}
                    </h2>
                    <p className="text-xs text-amber-400 font-medium">
                      {activeGuestRoom.category} · Floor {activeGuestRoom.floor}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">Thermostat</span>
                    <span className="text-sm font-mono font-bold text-slate-200">
                      {activeGuestRoom.temperature.toFixed(1)}°C
                    </span>
                  </div>
                </div>
              </div>

              {/* Guest Subtabs */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setGuestTab('key')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
                    guestTab === 'key' ? 'bg-emerald-400 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Digital Key
                </button>
                <button
                  onClick={() => setGuestTab('services')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
                    guestTab === 'services' ? 'bg-emerald-400 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Room Services
                </button>
                <button
                  onClick={() => setGuestTab('folio')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
                    guestTab === 'folio' ? 'bg-emerald-400 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  My Folio
                </button>
              </div>

              {serviceOrderFeedback && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{serviceOrderFeedback}</span>
                </div>
              )}

              {/* Tab Content: Digital Key */}
              {guestTab === 'key' && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-5">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>E2EE Encrypted Bluetooth NFC Credential</span>
                  </div>

                  {/* Circular Tap Sensor Ring */}
                  <div className="relative mx-auto w-40 h-40 flex items-center justify-center">
                    <div className={`absolute inset-0 rounded-full border-2 transition-all ${
                      keyNfcState === 'scanning'
                        ? 'border-emerald-400 animate-ping opacity-60'
                        : keyNfcState === 'unlocked'
                        ? 'border-emerald-400 scale-105'
                        : 'border-slate-800'
                    }`} />
                    <button
                      onClick={handleSimulateKeyTap}
                      disabled={keyNfcState !== 'idle'}
                      className={`w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer shadow-xl ${
                        keyNfcState === 'unlocked'
                          ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                          : keyNfcState === 'scanning'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
                      }`}
                    >
                      {keyNfcState === 'unlocked' ? (
                        <>
                          <Unlock className="w-8 h-8 stroke-[2.5]" />
                          <span className="text-xs font-bold mt-1">Unlocked</span>
                        </>
                      ) : keyNfcState === 'scanning' ? (
                        <>
                          <Clock className="w-8 h-8 animate-spin" />
                          <span className="text-xs font-bold mt-1">Authenticating</span>
                        </>
                      ) : (
                        <>
                          <KeyRound className="w-8 h-8 text-amber-400" />
                          <span className="text-xs font-semibold mt-1">Hold to Door</span>
                          <span className="text-[10px] text-slate-400">Tap to Unlock</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-xs text-slate-400">
                    Status:{' '}
                    <strong className={activeGuestRoom.doorLocked ? 'text-slate-300' : 'text-emerald-400'}>
                      {activeGuestRoom.doorLocked ? 'Door is Locked' : 'Door Deadbolt Released'}
                    </strong>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Hold phone within 4cm of the Room {activeGuestRoom.roomNumber} reader. Validated via AES-256 session token.
                  </p>
                </div>
              )}

              {/* Tab Content: Services */}
              {guestTab === 'services' && (
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-slate-300">
                    1-Tap In-Room Requests
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { name: 'Fresh Egyptian Towels', price: 0, icon: Sparkles },
                      { name: 'Artisan Espresso & Pastry', price: 18, icon: Coffee },
                      { name: 'Late Checkout to 14:00', price: 50, icon: Clock },
                      { name: 'Turn Down Service', price: 0, icon: Sparkles },
                    ].map(srv => {
                      const Icon = srv.icon;
                      return (
                        <button
                          key={srv.name}
                          onClick={() => handleOrderService(srv.name, srv.price)}
                          className="p-3 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-colors cursor-pointer space-y-1"
                        >
                          <Icon className="w-4 h-4 text-amber-400" />
                          <div className="text-xs font-semibold text-slate-100">{srv.name}</div>
                          <div className="text-[11px] text-emerald-400 font-mono">
                            {srv.price === 0 ? 'Complimentary' : `$${srv.price.toFixed(2)}`}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab Content: Folio */}
              {guestTab === 'folio' && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs text-slate-400">Current Room Balance:</span>
                    <span className="text-base font-mono font-bold text-amber-400">
                      ${guestOutstandingBalance.toFixed(2)}
                    </span>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {activeGuestFolios.map(item => (
                      <div key={item.id} className="flex justify-between text-xs py-1">
                        <span className="text-slate-300 truncate max-w-[200px]">{item.description}</span>
                        <span className="font-mono text-slate-100">${item.amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 text-center">
                    Settlement will charge automatically to authorized card at checkout.
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* =================== STAFF MOBILE VIEW =================== */
            <div className="space-y-4 pb-16">
              {/* Staff Header */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Housekeeping & Inspection Dispatch</span>
                  <span className="text-amber-400 font-mono">Staff ID #HK-04</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-100">
                    Turnaround Triage
                  </h2>
                  <span className="text-xs font-semibold text-slate-300">
                    Maria Silva (Lead)
                  </span>
                </div>
              </div>

              {/* Room Triage List */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-slate-300">
                  Rooms Requiring Attention
                </h3>

                {rooms.filter(r => r.status === 'Vacant Dirty' || r.status === 'Cleaning').slice(0, 4).map(room => (
                  <div
                    key={room.id}
                    onClick={() => setSelectedStaffRoomId(room.id)}
                    className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                      selectedStaffRoomId === room.id
                        ? 'bg-slate-900 border-amber-400/80 shadow-md'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold font-mono text-slate-100">
                          Room {room.roomNumber}
                        </span>
                        <span className="text-xs text-slate-400">Floor {room.floor}</span>
                      </div>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        room.status === 'Cleaning' ? 'bg-sky-400/10 text-sky-400' : 'bg-rose-400/10 text-rose-400'
                      }`}>
                        {room.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-1">{room.category}</p>
                    {room.notes && (
                      <p className="text-[11px] text-slate-400 mt-1 italic">"{room.notes}"</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile Inspection Checklist */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-semibold text-slate-200">
                  Fast Turnaround Checklist
                </h4>

                <div className="space-y-2 text-xs">
                  {[
                    { key: 'linen', label: 'Fresh Hypoallergenic Linens & Bed Dressed' },
                    { key: 'amenities', label: 'Bathroom Restocked & Towels Replaced' },
                    { key: 'minibar', label: 'Minibar Count Reconciled & Logged' },
                    { key: 'acReset', label: 'Thermostat Reset to Standard 21°C' },
                  ].map(item => (
                    <label
                      key={item.key}
                      className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-800/40 border border-slate-800 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={(checklist as any)[item.key]}
                        onChange={(e) => setChecklist({ ...checklist, [item.key]: e.target.checked })}
                        className="rounded text-amber-400 focus:ring-0"
                      />
                      <span className="text-slate-300">{item.label}</span>
                    </label>
                  ))}
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => {
                      onUpdateRoomStatus(selectedStaffRoomId, 'Vacant Clean', 'Maria Silva');
                      onLogAuditEvent(
                        'ROOM_STATUS_CHANGE',
                        `Staff mobile inspection certified Room as Vacant Clean.`,
                        'INFO'
                      );
                      alert('Room verified and certified Vacant Clean!');
                    }}
                    className="w-full py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-semibold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve as Vacant Clean</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ergonomic Bottom Navigation Bar (Thumb Zone) */}
        <div className="h-14 bg-slate-900 border-t border-slate-800 grid grid-cols-2 items-center px-4 z-40">
          <button
            onClick={() => setMode('staff')}
            className={`flex flex-col items-center justify-center h-full transition-colors cursor-pointer ${
              mode === 'staff' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="text-[10px] font-medium mt-0.5">Staff Mobile</span>
          </button>
          <button
            onClick={() => setMode('guest')}
            className={`flex flex-col items-center justify-center h-full transition-colors cursor-pointer ${
              mode === 'guest' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span className="text-[10px] font-medium mt-0.5">Guest Digital Key</span>
          </button>
        </div>
      </div>
    </div>
  );
};
