import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  DoorClosed, 
  DoorOpen, 
  Thermometer, 
  User, 
  Sparkles, 
  Wrench, 
  Key, 
  Check, 
  AlertTriangle, 
  X,
  CreditCard,
  Plus
} from 'lucide-react';
import { Room, RoomStatus, RoomCategory } from '../../types/hotel';

interface RoomInventoryGridProps {
  rooms: Room[];
  selectedRoom: Room | null;
  onSelectRoom: (room: Room | null) => void;
  onUpdateRoomStatus: (roomId: string, newStatus: RoomStatus, housekeeper?: string, notes?: string) => void;
  onToggleDoorLock: (roomId: string) => void;
  onUpdateTemperature: (roomId: string, delta: number) => void;
  onOpenNewReservationForRoom?: (roomNumber: string) => void;
}

export const RoomInventoryGrid: React.FC<RoomInventoryGridProps> = ({
  rooms,
  selectedRoom,
  onSelectRoom,
  onUpdateRoomStatus,
  onToggleDoorLock,
  onUpdateTemperature,
  onOpenNewReservationForRoom,
}) => {
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<RoomStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // Filtered rooms
  const filteredRooms = rooms.filter(room => {
    if (selectedFloor !== 'all' && room.floor !== selectedFloor) return false;
    if (statusFilter !== 'all' && room.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNumber = room.roomNumber.toLowerCase().includes(q);
      const matchGuest = room.guestName?.toLowerCase().includes(q);
      const matchCat = room.category.toLowerCase().includes(q);
      if (!matchNumber && !matchGuest && !matchCat) return false;
    }
    return true;
  });

  const getStatusColor = (status: RoomStatus) => {
    switch (status) {
      case 'Occupied':
        return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'Vacant Clean':
        return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Vacant Dirty':
        return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      case 'Cleaning':
        return 'text-sky-400 bg-sky-400/10 border-sky-400/20';
      case 'Reserved':
        return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'Maintenance':
        return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Real-Time Room Inventory Grid
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Multi-floor IoT telemetry, live occupancy distribution, and housekeeping turnaround controls.
          </p>
        </div>

        {/* Quick Inventory Summary */}
        <div className="flex items-center gap-4 text-xs text-slate-400 bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
          <div>
            <span className="text-slate-400">Total Rooms:</span>{' '}
            <span className="font-mono font-bold text-slate-100">{rooms.length}</span>
          </div>
          <div>
            <span className="text-slate-400">Occupied:</span>{' '}
            <span className="font-mono font-bold text-amber-400">
              {rooms.filter(r => r.status === 'Occupied').length}
            </span>
          </div>
          <div>
            <span className="text-slate-400">Vacant Clean:</span>{' '}
            <span className="font-mono font-bold text-emerald-400">
              {rooms.filter(r => r.status === 'Vacant Clean').length}
            </span>
          </div>
          <div>
            <span className="text-slate-400">Turnaround Needed:</span>{' '}
            <span className="font-mono font-bold text-rose-400">
              {rooms.filter(r => r.status === 'Vacant Dirty' || r.status === 'Cleaning').length}
            </span>
          </div>
        </div>
      </div>

      {/* Control Bar: Floor Tabs, Status Filters & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
        {/* Floor Selection Segmented Control */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setSelectedFloor('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                selectedFloor === 'all'
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Floors ({rooms.length})
            </button>
            <button
              onClick={() => setSelectedFloor(1)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                selectedFloor === 1
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Floor 1 · Garden
            </button>
            <button
              onClick={() => setSelectedFloor(2)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                selectedFloor === 2
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Floor 2 · Executive
            </button>
            <button
              onClick={() => setSelectedFloor(3)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                selectedFloor === 3
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Floor 3 · Skyline
            </button>
            <button
              onClick={() => setSelectedFloor(4)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                selectedFloor === 4
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Floor 4 · Penthouse
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search room # or guest..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Status Filters Bar */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/80">
          <span className="text-xs text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter by:
          </span>
          {(['all', 'Occupied', 'Vacant Clean', 'Vacant Dirty', 'Cleaning', 'Reserved', 'Maintenance'] as const).map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                  statusFilter === status
                    ? 'bg-slate-700 text-amber-300 font-semibold border border-amber-400/30'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-800/40'
                }`}
              >
                {status === 'all' ? 'All Statuses' : status}
              </button>
            )
          )}
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredRooms.map((room) => {
          const isSelected = selectedRoom?.id === room.id;
          return (
            <div
              key={room.id}
              onClick={() => {
                onSelectRoom(room);
                setEditNotes(room.notes || '');
              }}
              className={`bg-slate-900 border rounded-xl p-4 transition-all cursor-pointer relative group flex flex-col justify-between ${
                isSelected
                  ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-lg'
                  : 'border-slate-800 hover:border-slate-700 hover:shadow-md'
              }`}
            >
              {/* Header: Room Number & Status */}
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold font-mono text-slate-100">
                      {room.roomNumber}
                    </span>
                    <span className="text-xs text-slate-400">
                      Floor {room.floor}
                    </span>
                  </div>

                  <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${getStatusColor(room.status)}`}>
                    {room.status}
                  </span>
                </div>

                <div className="text-xs text-slate-300 font-medium mt-1">
                  {room.category}
                </div>

                {/* Occupant or Arrival State */}
                <div className="mt-3 py-2 border-t border-b border-slate-800/80">
                  {room.guestName ? (
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-200 font-medium truncate">
                        <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{room.guestName}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center justify-between">
                        <span>{room.occupants} guest{room.occupants > 1 ? 's' : ''}</span>
                        {room.checkOut && (
                          <span>Departs: {room.checkOut.substring(5)}</span>
                        )}
                      </div>
                    </div>
                  ) : room.status === 'Reserved' ? (
                    <div className="text-xs text-purple-300 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-purple-400" />
                      <span>Reserved for Arrival</span>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 flex items-center justify-between">
                      <span>Ready for booking</span>
                      <span className="text-emerald-400 font-mono">${room.nightRate}/nt</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer: IoT Telemetry & Action affordance */}
              <div className="mt-3 pt-1 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-mono tabular-nums">
                    <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                    {room.temperature.toFixed(1)}°C
                  </span>
                  <span className="flex items-center gap-1" title={room.doorLocked ? 'IoT Door Locked' : 'Door Unlocked'}>
                    {room.doorLocked ? (
                      <DoorClosed className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <DoorOpen className="w-3.5 h-3.5 text-rose-400" />
                    )}
                    <span className="text-[11px]">{room.doorLocked ? 'Locked' : 'Open'}</span>
                  </span>
                </div>

                <span className="font-mono font-semibold text-slate-200">
                  ${room.nightRate}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRooms.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
          <p className="text-sm">No rooms match the selected floor or status filters.</p>
          <button
            onClick={() => {
              setSelectedFloor('all');
              setStatusFilter('all');
              setSearchQuery('');
            }}
            className="mt-3 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Room Detail Slide-Over Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg h-full bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold font-mono text-slate-100">
                      Room {selectedRoom.roomNumber}
                    </h2>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${getStatusColor(selectedRoom.status)}`}>
                      {selectedRoom.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {selectedRoom.category} · Floor {selectedRoom.floor}
                  </p>
                </div>
                <button
                  onClick={() => onSelectRoom(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Update Quick Toggles */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  Dispatch Status Override
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => onUpdateRoomStatus(selectedRoom.id, 'Vacant Clean', selectedRoom.housekeeperAssigned)}
                    className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/60 transition-colors text-left font-medium cursor-pointer"
                  >
                    ✓ Mark Vacant Clean
                  </button>
                  <button
                    onClick={() => onUpdateRoomStatus(selectedRoom.id, 'Cleaning', 'Maria Silva')}
                    className="p-2 rounded-lg bg-sky-950/40 border border-sky-800/60 text-sky-300 hover:bg-sky-900/60 transition-colors text-left font-medium cursor-pointer"
                  >
                    ⚡ Start Cleaning
                  </button>
                  <button
                    onClick={() => onUpdateRoomStatus(selectedRoom.id, 'Vacant Dirty')}
                    className="p-2 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 hover:bg-rose-900/60 transition-colors text-left font-medium cursor-pointer"
                  >
                    ! Mark Vacant Dirty
                  </button>
                  <button
                    onClick={() => onUpdateRoomStatus(selectedRoom.id, 'Maintenance', undefined, 'Maintenance inspection logged')}
                    className="p-2 rounded-lg bg-orange-950/40 border border-orange-800/60 text-orange-300 hover:bg-orange-900/60 transition-colors text-left font-medium cursor-pointer"
                  >
                    🔧 Block for Maintenance
                  </button>
                </div>
              </div>

              {/* IoT Telemetry Controls */}
              <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-4 space-y-4">
                <h3 className="text-xs font-semibold text-slate-200">
                  In-Room IoT Telemetry Controls
                </h3>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-300 block font-medium">Smart Door Lock</span>
                    <span className="text-[11px] text-slate-400">
                      {selectedRoom.doorLocked ? 'Deadbolt engaged' : 'Unlocked / Accessible'}
                    </span>
                  </div>
                  <button
                    onClick={() => onToggleDoorLock(selectedRoom.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      selectedRoom.doorLocked
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {selectedRoom.doorLocked ? 'Unlock Door' : 'Lock Door'}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-xs text-slate-300 block font-medium">HVAC Thermostat</span>
                    <span className="text-sm font-mono font-bold text-amber-400">
                      {selectedRoom.temperature.toFixed(1)}°C / {(selectedRoom.temperature * 1.8 + 32).toFixed(1)}°F
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onUpdateTemperature(selectedRoom.id, -0.5)}
                      className="w-7 h-7 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-bold transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <button
                      onClick={() => onUpdateTemperature(selectedRoom.id, 0.5)}
                      className="w-7 h-7 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-bold transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Occupant Profile & Reservation Info */}
              {selectedRoom.guestName ? (
                <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Registered Guest</span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      ${selectedRoom.nightRate}/night
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-slate-100">
                    {selectedRoom.guestName}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
                    <span>Check-in: {selectedRoom.checkIn}</span>
                    <span>Check-out: {selectedRoom.checkOut}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-800/30 border border-slate-800 rounded-xl p-4 text-center">
                  <p className="text-xs text-slate-400 mb-3">Room is currently vacant without an active folio.</p>
                  {onOpenNewReservationForRoom && (
                    <button
                      onClick={() => onOpenNewReservationForRoom(selectedRoom.roomNumber)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
                    >
                      Book Room {selectedRoom.roomNumber}
                    </button>
                  )}
                </div>
              )}

              {/* Features & Amenities List */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Room Amenities
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRoom.features.map(f => (
                    <span key={f} className="text-xs text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700/60">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Staff Notes & Special Requests
                </label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="e.g. Extra feather pillows requested, VIP fruit basket..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400 h-20"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => onSelectRoom(null)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                Close Drawer
              </button>
              <button
                onClick={() => {
                  onUpdateRoomStatus(selectedRoom.id, selectedRoom.status, selectedRoom.housekeeperAssigned, editNotes);
                  onSelectRoom(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
              >
                Save Room Updates
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
