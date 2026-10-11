import React, { useState } from 'react';
import { X, Calendar, User, BedDouble, DollarSign, ShieldCheck } from 'lucide-react';
import { Room, RoomCategory } from '../../types/hotel';

interface NewReservationModalProps {
  rooms: Room[];
  initialRoomNumber?: string;
  onClose: () => void;
  onCreateReservation: (reservation: {
    roomNumber: string;
    guestName: string;
    email: string;
    country: string;
    checkIn: string;
    checkOut: string;
    occupants: number;
    specialNotes: string;
  }) => void;
}

export const NewReservationModal: React.FC<NewReservationModalProps> = ({
  rooms,
  initialRoomNumber,
  onClose,
  onCreateReservation,
}) => {
  const vacantRooms = rooms.filter(r => r.status === 'Vacant Clean' || r.status === 'Reserved');
  const [selectedRoomNumber, setSelectedRoomNumber] = useState(
    initialRoomNumber || (vacantRooms[0]?.roomNumber || rooms[0].roomNumber)
  );
  const [guestName, setGuestName] = useState('Alexander Wright');
  const [email, setEmail] = useState('a.wright@auroracap.com');
  const [country, setCountry] = useState('United States');
  const [checkIn, setCheckIn] = useState('2026-10-12');
  const [checkOut, setCheckOut] = useState('2026-10-16');
  const [occupants, setOccupants] = useState(2);
  const [specialNotes, setSpecialNotes] = useState('High floor preferred, late arrival via flight.');

  const selectedRoomObj = rooms.find(r => r.roomNumber === selectedRoomNumber);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !selectedRoomNumber) return;

    onCreateReservation({
      roomNumber: selectedRoomNumber,
      guestName,
      email,
      country,
      checkIn,
      checkOut,
      occupants,
      specialNotes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Create New Guest Reservation
            </h3>
            <p className="text-xs text-slate-400">
              Direct booking engine reservation with real-time room lock and E2EE folio generation.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Room Selection */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Assign Available Room
          </label>
          <select
            value={selectedRoomNumber}
            onChange={(e) => setSelectedRoomNumber(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
          >
            {rooms.map(room => (
              <option key={room.id} value={room.roomNumber}>
                Room {room.roomNumber} ({room.category} · Floor {room.floor}) - ${room.nightRate}/nt [{room.status}]
              </option>
            ))}
          </select>
          {selectedRoomObj && (
            <p className="text-[11px] text-amber-400 mt-1 font-mono">
              Nightly Rate: ${selectedRoomObj.nightRate}.00 USD · Current Status: {selectedRoomObj.status}
            </p>
          )}
        </div>

        {/* Guest Information */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Guest Full Name
            </label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Contact Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Stay Dates */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Check-In Date
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Check-Out Date
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Occupants
            </label>
            <input
              type="number"
              min={1}
              max={6}
              value={occupants}
              onChange={(e) => setOccupants(parseInt(e.target.value) || 1)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Guest Requests & Notes
          </label>
          <input
            type="text"
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>MFA Protected & GDPR Logged</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
            >
              Confirm & Book Room
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
