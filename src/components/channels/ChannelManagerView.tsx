import React, { useState } from 'react';
import { 
  Radio, 
  RefreshCw, 
  CheckCircle2, 
  ExternalLink, 
  Sliders, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle,
  CreditCard,
  Building,
  Check
} from 'lucide-react';
import { BookingChannel, Room } from '../../types/hotel';

interface ChannelManagerViewProps {
  channels: BookingChannel[];
  rooms: Room[];
  onTriggerChannelSync: () => void;
  onSimulateInboundBooking: (channelName: string) => void;
  onUpdateRateMultiplier: (channelId: string, newMultiplier: number) => void;
  onToggleInventorySync: (channelId: string) => void;
  onLogAuditEvent: (actionType: any, details: string, severity?: any) => void;
}

export const ChannelManagerView: React.FC<ChannelManagerViewProps> = ({
  channels,
  rooms,
  onTriggerChannelSync,
  onSimulateInboundBooking,
  onUpdateRateMultiplier,
  onToggleInventorySync,
  onLogAuditEvent,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const totalMonthlyChannelRevenue = channels.reduce((acc, c) => acc + c.revenueThisMonth, 0);
  const totalMonthlyBookings = channels.reduce((acc, c) => acc + c.bookingsThisMonth, 0);

  const handleManualSync = () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    onTriggerChannelSync();

    setTimeout(() => {
      setIsSyncing(false);
      setSyncFeedback('All 7 channels synchronized with real-time rate parity.');
      setTimeout(() => setSyncFeedback(null), 4000);
    }, 1200);
  };

  const bookingEngines = channels.filter(c => c.type !== 'Payment Gateway');
  const paymentGateways = channels.filter(c => c.type === 'Payment Gateway');

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Channel Manager & Booking Engine Integrations
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            2-Way XML rate parity, automated OTA room inventory synchronization, and webhook connectors.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onSimulateInboundBooking('Expedia Partner Central')}
            className="px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulate Inbound OTA Reservation</span>
          </button>
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-amber-400/20 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Pushing 2-Way Rates...' : 'Push Real-Time Inventory & Rates'}</span>
          </button>
        </div>
      </div>

      {syncFeedback && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncFeedback}</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400">200 OK WebSocket Broadcast</span>
        </div>
      )}

      {/* Aggregate Channel Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Monthly Channel Gross</span>
            <Building className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono tabular-nums">
            ${totalMonthlyChannelRevenue.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            <span>Direct Engine + OTAs + GDS</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Monthly Bookings</span>
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
            {totalMonthlyBookings.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            <span>Direct share: 44.2%</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Active Listings</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono tabular-nums">
            {rooms.length} <span className="text-xs font-normal text-slate-400">rooms mapped</span>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            <span>All 4 floors in parity</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>API Webhook Status</span>
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-sm font-bold text-emerald-400 font-mono mt-1">
            ACTIVE & HEALTHY
          </div>
          <div className="text-xs text-slate-400 mt-2">
            <span>Average latency: 84ms</span>
          </div>
        </div>
      </div>

      {/* Booking Engines & Channel List */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
          <span>Connected Booking Engines & Distribution Channels</span>
          <span className="text-xs text-slate-400 font-normal">
            ({bookingEngines.length} Channels Connected)
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookingEngines.map(channel => (
            <div
              key={channel.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden="true">{channel.logo}</span>
                  <div>
                    <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                      {channel.name}
                      <span className="text-xs font-normal text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                        {channel.status}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {channel.type} · Last synchronized: {channel.lastSync}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onToggleInventorySync(channel.id)}
                  className={`text-xs px-2.5 py-1 rounded transition-colors cursor-pointer font-medium ${
                    channel.inventorySyncActive
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {channel.inventorySyncActive ? 'Sync Active' : 'Sync Paused'}
                </button>
              </div>

              {/* Performance numbers */}
              <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-400 block">Listings Mapped</span>
                  <span className="font-mono font-semibold text-slate-200 tabular-nums">
                    {channel.activeListingsCount} Rooms
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Monthly Bookings</span>
                  <span className="font-mono font-semibold text-slate-200 tabular-nums">
                    {channel.bookingsThisMonth}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Channel Revenue</span>
                  <span className="font-mono font-semibold text-amber-400 tabular-nums">
                    ${channel.revenueThisMonth.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Rate Parity Multiplier Controller */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    Rate Multiplier (Commission Offset)
                  </span>
                  <span className="font-mono font-bold text-amber-400">
                    x{channel.rateMultiplier.toFixed(2)} ({(channel.rateMultiplier * 100 - 100).toFixed(0)}% markup)
                  </span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="1.30"
                  step="0.01"
                  value={channel.rateMultiplier}
                  onChange={(e) => onUpdateRateMultiplier(channel.id, parseFloat(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>1.00 (Base Rate)</span>
                  <span>1.15 (+15% OTA)</span>
                  <span>1.30 (+30% Max)</span>
                </div>
              </div>

              {/* Quick simulation button */}
              <div className="pt-1 flex justify-end">
                <button
                  onClick={() => onSimulateInboundBooking(channel.name)}
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium cursor-pointer"
                >
                  <span>Simulate Webhook Booking</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integrated Payment Gateways Section */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
          <span>Integrated Payment Gateways & Merchant Accounts</span>
          <span className="text-xs text-slate-400 font-normal">
            (PCI-DSS Level 1 Encrypted)
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentGateways.map(gateway => (
            <div
              key={gateway.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden="true">{gateway.logo}</span>
                  <div>
                    <h3 className="text-base font-semibold text-slate-100">
                      {gateway.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Compliance: {gateway.lastSync}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-emerald-400 font-semibold bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                  {gateway.status}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs py-2 border-t border-slate-800 text-slate-300">
                <span>Transactions This Month:</span>
                <span className="font-mono font-bold text-slate-100">{gateway.bookingsThisMonth} processed</span>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-300">
                <span>Gross Settled Volume:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  ${gateway.revenueThisMonth.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
