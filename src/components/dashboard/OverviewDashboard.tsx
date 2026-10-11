import React, { useState } from 'react';
import { 
  TrendingUp, 
  BedDouble, 
  DollarSign, 
  Users, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Calendar, 
  ShieldCheck, 
  RefreshCw, 
  Smartphone, 
  KeyRound,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Room, Guest, FolioItem, BookingChannel, AuditLogEntry, SecurityStatus } from '../../types/hotel';

interface OverviewDashboardProps {
  rooms: Room[];
  guests: Guest[];
  folios: FolioItem[];
  channels: BookingChannel[];
  auditLogs: AuditLogEntry[];
  security: SecurityStatus;
  onNavigateToTab: (tab: 'inventory' | 'guests' | 'billing' | 'channels' | 'security') => void;
  onOpenMobileView: (mode: 'staff' | 'guest') => void;
  onSelectRoom: (room: Room) => void;
  onTriggerNightAudit: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  rooms,
  guests,
  folios,
  channels,
  auditLogs,
  security,
  onNavigateToTab,
  onOpenMobileView,
  onSelectRoom,
  onTriggerNightAudit,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(3); // current day

  // Dynamic calculations
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.status === 'Occupied');
  const reservedRooms = rooms.filter(r => r.status === 'Reserved');
  const dirtyRooms = rooms.filter(r => r.status === 'Vacant Dirty');
  const cleaningRooms = rooms.filter(r => r.status === 'Cleaning');
  const vacantCleanRooms = rooms.filter(r => r.status === 'Vacant Clean');
  const maintenanceRooms = rooms.filter(r => r.status === 'Maintenance');

  const occupancyRate = ((occupiedRooms.length / totalRooms) * 100).toFixed(1);
  const totalDailyRoomRevenue = occupiedRooms.reduce((acc, r) => acc + r.nightRate, 0);
  const adr = occupiedRooms.length > 0 ? (totalDailyRoomRevenue / occupiedRooms.length).toFixed(2) : '0.00';
  const revPar = (totalDailyRoomRevenue / totalRooms).toFixed(2);

  // Folio revenue today
  const ancillaryRevenue = folios
    .filter(f => f.category !== 'Room Charge')
    .reduce((acc, f) => acc + f.amount, 0);

  // 7-day projection mock data
  const weeklyTrends = [
    { day: 'Wed', date: 'Oct 08', occupancy: 75.0, adr: 320, revpar: 240, revenue: 5760 },
    { day: 'Thu', date: 'Oct 09', occupancy: 83.3, adr: 335, revpar: 279, revenue: 6700 },
    { day: 'Fri', date: 'Oct 10', occupancy: 91.6, adr: 380, revpar: 348, revenue: 8360 },
    { day: 'Today', date: 'Oct 11', occupancy: Number(occupancyRate), adr: Number(adr), revpar: Number(revPar), revenue: totalDailyRoomRevenue },
    { day: 'Sun', date: 'Oct 12', occupancy: 87.5, adr: 360, revpar: 315, revenue: 7560 },
    { day: 'Mon', date: 'Oct 13', occupancy: 70.8, adr: 310, revpar: 219, revenue: 5270 },
    { day: 'Tue', date: 'Oct 14', occupancy: 79.2, adr: 325, revpar: 257, revenue: 6180 },
  ];

  const currentTrend = weeklyTrends[selectedDayIndex] || weeklyTrends[3];

  return (
    <div className="space-y-6">
      {/* Editorial Title Bar & Real-time Status */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Property Oversight & Operations Control
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time multi-channel inventory, automated night auditing, and encrypted telemetry across all 4 floors.
          </p>
        </div>

        {/* Quick Operations Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onOpenMobileView('staff')}
            className="px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            <span>Mobile Staff Triage</span>
          </button>
          <button
            onClick={() => onOpenMobileView('guest')}
            className="px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
            <span>Guest Mobile Key</span>
          </button>
          <button
            onClick={onTriggerNightAudit}
            className="px-3 py-2 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-emerald-400/20 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Run Night Audit</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Occupancy Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Occupancy Rate</span>
            <BedDouble className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono tabular-nums">
            {occupancyRate}%
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <span className="text-emerald-400 font-medium font-mono tabular-nums">{occupiedRooms.length}</span>
            <span>of {totalRooms} rooms active</span>
          </div>
        </div>

        {/* RevPAR */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>RevPAR</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono tabular-nums">
            ${revPar}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            <span>Per available room/day</span>
          </div>
        </div>

        {/* ADR */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Average Daily Rate</span>
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono tabular-nums">
            ${adr}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            <span>Weighted ADR today</span>
          </div>
        </div>

        {/* Total Projected Revenue Today */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Day's Room Yield</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono tabular-nums">
            ${totalDailyRoomRevenue.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            <span>+${ancillaryRevenue.toFixed(0)} ancillary folios</span>
          </div>
        </div>

        {/* Housekeeping Triage */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Housekeeping</span>
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono tabular-nums">
            {vacantCleanRooms.length} <span className="text-xs font-normal text-slate-400">clean</span>
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <span className="text-amber-400 font-mono tabular-nums">{dirtyRooms.length} dirty</span>
            <span>·</span>
            <span className="text-sky-400 font-mono tabular-nums">{cleaningRooms.length} cleaning</span>
          </div>
        </div>

        {/* Security / Compliance */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Security Status</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-sm font-bold text-emerald-400 font-mono">
            E2EE ACTIVE
          </div>
          <div className="text-xs text-slate-400 mt-2">
            <span>MFA & GDPR Enforced</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Revenue Analytics & Real-Time Operational Triage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Weekly Yield Analytics & Channel Distribution */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue & Occupancy Trend Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <div>
                <h2 className="text-base font-semibold text-slate-100">
                  Occupancy & Yield Trajectory (7-Day Rolling Horizon)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select a day to inspect forecast occupancy, RevPAR, and automated night audit totals.
                </p>
              </div>

              {/* Day filter selector */}
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
                {weeklyTrends.map((trend, idx) => (
                  <button
                    key={trend.day}
                    onClick={() => setSelectedDayIndex(idx)}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                      selectedDayIndex === idx
                        ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {trend.day}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Bar Visualization */}
            <div className="grid grid-cols-7 gap-2 pt-4 pb-2 border-b border-slate-800">
              {weeklyTrends.map((item, index) => {
                const isSelected = selectedDayIndex === index;
                const barHeight = Math.max(20, Math.round(item.occupancy));
                return (
                  <button
                    key={item.day}
                    onClick={() => setSelectedDayIndex(index)}
                    className={`flex flex-col items-center group cursor-pointer focus:outline-none p-2 rounded-lg transition-colors ${
                      isSelected ? 'bg-slate-800/80 ring-1 ring-amber-400/40' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <span className="text-xs font-mono tabular-nums text-slate-400 mb-2">
                      {item.occupancy.toFixed(0)}%
                    </span>
                    <div className="w-full h-32 flex items-end justify-center">
                      <div
                        style={{ height: `${barHeight}%` }}
                        className={`w-full max-w-[28px] rounded-t transition-all ${
                          isSelected
                            ? 'bg-gradient-to-t from-amber-600 to-amber-400 shadow-md shadow-amber-500/20'
                            : 'bg-slate-700 group-hover:bg-slate-600'
                        }`}
                      />
                    </div>
                    <span className={`text-xs mt-2.5 font-medium ${isSelected ? 'text-amber-400 font-semibold' : 'text-slate-400'}`}>
                      {item.day}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.date}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Day Telemetry Card */}
            <div className="mt-4 pt-2 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-slate-400 block">Date Horizon</span>
                  <span className="font-semibold text-slate-200 font-mono">{currentTrend.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Occupancy</span>
                  <span className="font-semibold text-amber-400 font-mono tabular-nums">{currentTrend.occupancy}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Projected ADR</span>
                  <span className="font-semibold text-slate-200 font-mono tabular-nums">${currentTrend.adr.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">RevPAR</span>
                  <span className="font-semibold text-emerald-400 font-mono tabular-nums">${currentTrend.revpar.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-slate-400 block">Total Forecast Yield</span>
                <span className="text-base font-bold text-slate-100 font-mono tabular-nums">
                  ${currentTrend.revenue.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Integrated Channel Revenue & Parity Feed */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-slate-100">
                  Channel Distribution & Direct Engine Yield
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Synchronized inventory distribution across OTAs, direct engine, and GDS platforms.
                </p>
              </div>
              <button
                onClick={() => onNavigateToTab('channels')}
                className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Manage Channels</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {channels.slice(0, 4).map(channel => (
                <div
                  key={channel.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg" aria-hidden="true">{channel.logo}</span>
                    <div>
                      <div className="text-sm font-medium text-slate-200">
                        {channel.name}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{channel.type}</span>
                        <span>·</span>
                        <span>{channel.bookingsThisMonth} bookings this month</span>
                        <span>·</span>
                        <span className="text-emerald-400">Sync {channel.lastSync}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-100 font-mono tabular-nums">
                      ${channel.revenueThisMonth.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      Rate Parity: x{channel.rateMultiplier.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Immediate Operational Triage & Housekeeping Radar */}
        <div className="space-y-6">
          {/* Urgent Front Desk & Turnaround Triage */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Today's Front Desk Arrivals</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono tabular-nums">
                {reservedRooms.length} Incoming
              </span>
            </div>

            <div className="space-y-2.5">
              {reservedRooms.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">No pending arrivals today.</p>
              ) : (
                reservedRooms.map(room => (
                  <div
                    key={room.id}
                    onClick={() => onSelectRoom(room)}
                    className="p-3 rounded-lg bg-slate-800/50 border border-slate-800 hover:border-amber-400/50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-amber-400">
                        Room {room.roomNumber}
                      </span>
                      <span className="text-xs text-slate-300 font-mono tabular-nums font-semibold">
                        ${room.nightRate}/nt
                      </span>
                    </div>
                    <div className="text-sm font-medium text-slate-200 mt-1">
                      {room.guestName || 'VIP Reservation'}
                    </div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                      <span>{room.category}</span>
                      <span className="text-amber-300/80">Check-in Expected</span>
                    </div>
                    {room.notes && (
                      <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-1 italic">
                        "{room.notes}"
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Housekeeping Turnaround Queue */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span>Turnaround Dispatch</span>
              </h2>
              <button
                onClick={() => onNavigateToTab('inventory')}
                className="text-xs text-amber-400 hover:text-amber-300"
              >
                All Rooms
              </button>
            </div>

            <div className="space-y-2.5">
              {dirtyRooms.concat(cleaningRooms).slice(0, 4).map(room => (
                <div
                  key={room.id}
                  onClick={() => onSelectRoom(room)}
                  className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-200">
                        Room {room.roomNumber}
                      </span>
                      <span className="text-xs text-slate-400">· Floor {room.floor}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {room.housekeeperAssigned ? `Assigned: ${room.housekeeperAssigned}` : 'Unassigned queue'}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs font-medium ${room.status === 'Cleaning' ? 'text-sky-400' : 'text-amber-400'}`}>
                      {room.status}
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">
                      Priority: {room.cleaningPriority}
                    </span>
                  </div>
                </div>
              ))}

              {dirtyRooms.length === 0 && cleaningRooms.length === 0 && (
                <div className="p-4 text-center text-xs text-slate-400">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  All rooms inspected and clean.
                </div>
              )}
            </div>
          </div>

          {/* Administrative Security & Compliance Audit Snippet */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Security & Audit Stream</span>
              </h2>
              <button
                onClick={() => onNavigateToTab('security')}
                className="text-xs text-amber-400 hover:text-amber-300"
              >
                View Full Log
              </button>
            </div>

            <div className="space-y-2.5">
              {auditLogs.slice(0, 3).map(log => (
                <div key={log.id} className="text-xs p-2 rounded bg-slate-800/30 border border-slate-800/60">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-mono text-amber-300/80">{log.actionType}</span>
                    <span className="font-mono tabular-nums">{log.timestamp.split(' ')[1]}</span>
                  </div>
                  <p className="text-slate-300 mt-1 line-clamp-1">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
