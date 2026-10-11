import React, { useState } from 'react';
import { Header, ActiveTab } from './components/layout/Header';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { RoomInventoryGrid } from './components/inventory/RoomInventoryGrid';
import { GuestAnalyticsView } from './components/guests/GuestAnalyticsView';
import { AutomatedBillingView } from './components/billing/AutomatedBillingView';
import { ChannelManagerView } from './components/channels/ChannelManagerView';
import { SecurityComplianceSuite } from './components/security/SecurityComplianceSuite';
import { MobileCompanionModal } from './components/mobile/MobileCompanionModal';
import { NewReservationModal } from './components/reservations/NewReservationModal';
import { MfaModal } from './components/security/MfaModal';
import { 
  INITIAL_ROOMS, 
  INITIAL_GUESTS, 
  INITIAL_FOLIOS, 
  INITIAL_CHANNELS, 
  INITIAL_AUDIT_LOGS 
} from './data/mockData';
import { 
  Room, 
  Guest, 
  FolioItem, 
  BookingChannel, 
  AuditLogEntry, 
  SecurityStatus, 
  RoomStatus 
} from './types/hotel';
import { createAuditLogEntry } from './services/securityService';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Core Hotel State
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [guests, setGuests] = useState<Guest[]>(INITIAL_GUESTS);
  const [folios, setFolios] = useState<FolioItem[]>(INITIAL_FOLIOS);
  const [channels, setChannels] = useState<BookingChannel[]>(INITIAL_CHANNELS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  const [security, setSecurity] = useState<SecurityStatus>({
    e2eeEnabled: true,
    encryptionAlgorithm: 'AES-256-GCM / RSA-4096',
    activeKeyVersion: 'v2026.4-sec',
    mfaEnforced: true,
    gdprCompliant: true,
    ccpaCompliant: true,
    activeStaffRole: 'Hotel General Manager',
  });

  // Modal states
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [mobileModalState, setMobileModalState] = useState<{ isOpen: boolean; mode: 'staff' | 'guest'; roomNumber?: string }>({
    isOpen: false,
    mode: 'staff',
  });
  const [isNewReservationOpen, setIsNewReservationOpen] = useState(false);
  const [reservationPresetRoom, setReservationPresetRoom] = useState<string | undefined>(undefined);
  const [isMfaModalOpen, setIsMfaModalOpen] = useState(false);

  // Helper to append audit log
  const logAuditEvent = (
    actionType: AuditLogEntry['actionType'],
    details: string,
    severity: AuditLogEntry['severity'] = 'INFO'
  ) => {
    const newEntry = createAuditLogEntry(
      `Amanuel Hile (${security.activeStaffRole})`,
      security.activeStaffRole,
      actionType,
      details,
      severity
    );
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  // Handlers
  const handleUpdateRoomStatus = (
    roomId: string,
    newStatus: RoomStatus,
    housekeeper?: string,
    notes?: string
  ) => {
    setRooms(prev =>
      prev.map(r => {
        if (r.id === roomId) {
          const updated = {
            ...r,
            status: newStatus,
            housekeeperAssigned: housekeeper !== undefined ? housekeeper : r.housekeeperAssigned,
            notes: notes !== undefined ? notes : r.notes,
          };
          if (newStatus === 'Vacant Clean') {
            updated.cleaningPriority = 'Low';
          }
          return updated;
        }
        return r;
      })
    );

    const room = rooms.find(r => r.id === roomId);
    logAuditEvent(
      'ROOM_STATUS_CHANGE',
      `Updated Room ${room?.roomNumber || roomId} status to ${newStatus}.${housekeeper ? ` Housekeeper: ${housekeeper}.` : ''}`
    );
  };

  const handleToggleDoorLock = (roomId: string) => {
    setRooms(prev =>
      prev.map(r => {
        if (r.id === roomId) {
          const nextLock = !r.doorLocked;
          logAuditEvent(
            'MFA_CHALLENGE',
            `IoT Door deadbolt ${nextLock ? 'locked' : 'unlocked'} for Room ${r.roomNumber}.`
          );
          return { ...r, doorLocked: nextLock };
        }
        return r;
      })
    );
  };

  const handleUpdateTemperature = (roomId: string, delta: number) => {
    setRooms(prev =>
      prev.map(r => {
        if (r.id === roomId) {
          const newTemp = Math.round((r.temperature + delta) * 10) / 10;
          return { ...r, temperature: newTemp };
        }
        return r;
      })
    );
  };

  const handleAddFolioCharge = (item: Omit<FolioItem, 'id' | 'timestamp'>) => {
    const newItem: FolioItem = {
      ...item,
      id: `f-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setFolios(prev => [...prev, newItem]);
  };

  const handleSettleFolio = (roomNumber: string, paymentMethod: string) => {
    setFolios(prev =>
      prev.map(f => {
        if (f.roomNumber === roomNumber && f.status === 'Posted') {
          return { ...f, status: 'Settled', paymentMethod };
        }
        return f;
      })
    );
  };

  const handleTriggerNightAudit = () => {
    const occupied = rooms.filter(r => r.status === 'Occupied');
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newCharges: FolioItem[] = occupied.map(room => ({
      id: `f-night-${room.roomNumber}-${Date.now().toString().slice(-4)}`,
      guestId: room.guestId || 'anon',
      roomNumber: room.roomNumber,
      category: 'Room Charge',
      description: `${room.category} - Nightly Accommodation Auto-Post`,
      amount: room.nightRate,
      timestamp: nowStr,
      status: 'Posted',
    }));

    setFolios(prev => [...prev, ...newCharges]);

    logAuditEvent(
      'NIGHT_AUDIT_RUN',
      `Automated Night Audit Run: Processed ${occupied.length} occupied rooms, posted $${occupied.reduce((a, b) => a + b.nightRate, 0).toLocaleString()} room charges, balanced VAT ledgers.`
    );
  };

  const handleTriggerChannelSync = () => {
    const nowTime = 'Just now';
    setChannels(prev =>
      prev.map(c => ({
        ...c,
        lastSync: nowTime,
        status: 'Connected',
      }))
    );
    logAuditEvent(
      'OTA_SYNC_TRIGGERED',
      '2-Way XML availability and rate parity push executed across all active OTAs and GDS channels.'
    );
  };

  const handleSimulateInboundBooking = (channelName: string) => {
    // Find first vacant clean room
    const targetRoom = rooms.find(r => r.status === 'Vacant Clean') || rooms.find(r => r.status === 'Vacant Dirty');
    if (!targetRoom) {
      alert('No available rooms to allocate for inbound booking simulation.');
      return;
    }

    const mockNames = ['Baroness Clarissa Vance', 'Dmitri Volkov', 'Maya Angelou Chen', 'Henrik Lindqvist'];
    const assignedGuest = mockNames[Math.floor(Math.random() * mockNames.length)];

    setRooms(prev =>
      prev.map(r => {
        if (r.id === targetRoom.id) {
          return {
            ...r,
            status: 'Reserved',
            guestName: assignedGuest,
            checkIn: '2026-10-12',
            checkOut: '2026-10-15',
            notes: `Booked via ${channelName} webhook. Instant 2-way sync confirmation.`,
          };
        }
        return r;
      })
    );

    // Update channel stats
    setChannels(prev =>
      prev.map(c => {
        if (c.name.toLowerCase().includes(channelName.toLowerCase().slice(0, 5))) {
          return {
            ...c,
            bookingsThisMonth: c.bookingsThisMonth + 1,
            revenueThisMonth: c.revenueThisMonth + targetRoom.nightRate * 3,
            lastSync: 'Real-time Webhook (1s ago)',
          };
        }
        return c;
      })
    );

    logAuditEvent(
      'OTA_SYNC_TRIGGERED',
      `Inbound reservation received from ${channelName} for Room ${targetRoom.roomNumber} (${assignedGuest}). Inventory adjusted to Reserved.`
    );

    alert(`Inbound Webhook Received from ${channelName}!\nAllocated Room ${targetRoom.roomNumber} to ${assignedGuest}.`);
  };

  const handleUpdateRateMultiplier = (channelId: string, newMultiplier: number) => {
    setChannels(prev =>
      prev.map(c => (c.id === channelId ? { ...c, rateMultiplier: newMultiplier } : c))
    );
    const target = channels.find(c => c.id === channelId);
    logAuditEvent(
      'RATE_OVERRIDE',
      `Adjusted rate parity multiplier for ${target?.name} to x${newMultiplier.toFixed(2)} (${((newMultiplier - 1) * 100).toFixed(0)}% OTA markup).`
    );
  };

  const handleToggleInventorySync = (channelId: string) => {
    setChannels(prev =>
      prev.map(c => {
        if (c.id === channelId) {
          const next = !c.inventorySyncActive;
          return { ...c, inventorySyncActive: next, status: next ? 'Connected' : 'Paused' };
        }
        return c;
      })
    );
  };

  const handleRotateKeys = () => {
    const nextVer = `v2026.${Math.floor(5 + Math.random() * 5)}-sec`;
    setSecurity(prev => ({
      ...prev,
      activeKeyVersion: nextVer,
    }));
    logAuditEvent(
      'SECURITY_KEY_ROTATION',
      `Rotated master AES-256-GCM encryption cluster key to version ${nextVer}. HSM key derivation validated.`
    );
  };

  const handleForgetGuest = (guestId: string, guestName: string) => {
    setGuests(prev =>
      prev.map(g => {
        if (g.id === guestId) {
          return {
            ...g,
            name: '[ERASED - GDPR ART. 17]',
            email: 'erased-gdpr@anonymized.internal',
            phone: 'REDACTED',
            maskedPassport: 'REDACTED',
            maskedCreditCard: 'REDACTED',
            encryptedPiiToken: 'PURGED_CRYPTO_SHRED',
          };
        }
        return g;
      })
    );

    logAuditEvent(
      'GDPR_FORGET_REQUEST',
      `Executed GDPR Article 17 "Right to be Forgotten" for data subject ${guestName} (${guestId}). Cryptographic shredding applied to PII records.`,
      'WARNING'
    );
  };

  const handleCreateReservation = (reservation: {
    roomNumber: string;
    guestName: string;
    email: string;
    country: string;
    checkIn: string;
    checkOut: string;
    occupants: number;
    specialNotes: string;
  }) => {
    setRooms(prev =>
      prev.map(r => {
        if (r.roomNumber === reservation.roomNumber) {
          return {
            ...r,
            status: 'Occupied',
            guestName: reservation.guestName,
            checkIn: reservation.checkIn,
            checkOut: reservation.checkOut,
            occupants: reservation.occupants,
            notes: reservation.specialNotes,
          };
        }
        return r;
      })
    );

    // Create guest profile if not already present
    const existingGuest = guests.find(g => g.name.toLowerCase() === reservation.guestName.toLowerCase());
    if (!existingGuest) {
      const newGuest: Guest = {
        id: `g-${Math.floor(100 + Math.random() * 900)}`,
        name: reservation.guestName,
        email: reservation.email,
        phone: '+1 (555) 019-9482',
        country: reservation.country,
        tier: 'Standard',
        lifetimeSpend: 0,
        staysCount: 1,
        loyaltyPoints: 500,
        currentRoom: reservation.roomNumber,
        preferences: {
          pillowType: 'Standard Feather',
          floorPreference: 'Standard',
          dietary: 'None Specified',
          lateCheckoutRequested: false,
          quietRoom: true,
        },
        maskedPassport: `${reservation.country.substring(0, 2).toUpperCase()}-••••••${Math.floor(1000 + Math.random() * 9000)}`,
        maskedCreditCard: 'Visa •••• 4120',
        encryptedPiiToken: `aes256:${Math.random().toString(16).substring(2, 14)}`,
        gdprConsentDate: new Date().toISOString().substring(0, 10),
        ccpaOptOut: false,
      };
      setGuests(prev => [newGuest, ...prev]);
    }

    // Add initial accommodation folio
    const targetRoom = rooms.find(r => r.roomNumber === reservation.roomNumber);
    if (targetRoom) {
      handleAddFolioCharge({
        guestId: existingGuest?.id || 'new-guest',
        roomNumber: reservation.roomNumber,
        category: 'Room Charge',
        description: `${targetRoom.category} - Nightly Accommodation`,
        amount: targetRoom.nightRate,
        status: 'Posted',
      });
    }

    logAuditEvent(
      'ROOM_STATUS_CHANGE',
      `Created reservation & checked in ${reservation.guestName} into Room ${reservation.roomNumber} (${reservation.checkIn} to ${reservation.checkOut}).`
    );

    setActiveTab('inventory');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-300">
      {/* Universal Top Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        security={security}
        onOpenMobileView={(mode) => setMobileModalState({ isOpen: true, mode })}
        onOpenNewReservation={() => {
          setReservationPresetRoom(undefined);
          setIsNewReservationOpen(true);
        }}
        onOpenMfaModal={() => setIsMfaModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <OverviewDashboard
            rooms={rooms}
            guests={guests}
            folios={folios}
            channels={channels}
            auditLogs={auditLogs}
            security={security}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onOpenMobileView={(mode) => setMobileModalState({ isOpen: true, mode })}
            onSelectRoom={(room) => {
              setSelectedRoom(room);
              setActiveTab('inventory');
            }}
            onTriggerNightAudit={handleTriggerNightAudit}
          />
        )}

        {activeTab === 'inventory' && (
          <RoomInventoryGrid
            rooms={rooms}
            selectedRoom={selectedRoom}
            onSelectRoom={setSelectedRoom}
            onUpdateRoomStatus={handleUpdateRoomStatus}
            onToggleDoorLock={handleToggleDoorLock}
            onUpdateTemperature={handleUpdateTemperature}
            onOpenNewReservationForRoom={(roomNumber) => {
              setReservationPresetRoom(roomNumber);
              setIsNewReservationOpen(true);
            }}
            onOpenGuestPortal={(roomNumber) => {
              setMobileModalState({ isOpen: true, mode: 'guest', roomNumber });
            }}
          />
        )}

        {activeTab === 'guests' && (
          <GuestAnalyticsView
            guests={guests}
            onLogAuditEvent={logAuditEvent}
            onForgetGuest={handleForgetGuest}
          />
        )}

        {activeTab === 'billing' && (
          <AutomatedBillingView
            folios={folios}
            rooms={rooms}
            guests={guests}
            onAddCharge={handleAddFolioCharge}
            onSettleFolio={handleSettleFolio}
            onTriggerNightAudit={handleTriggerNightAudit}
            onLogAuditEvent={logAuditEvent}
          />
        )}

        {activeTab === 'channels' && (
          <ChannelManagerView
            channels={channels}
            rooms={rooms}
            onTriggerChannelSync={handleTriggerChannelSync}
            onSimulateInboundBooking={handleSimulateInboundBooking}
            onUpdateRateMultiplier={handleUpdateRateMultiplier}
            onToggleInventorySync={handleToggleInventorySync}
            onLogAuditEvent={logAuditEvent}
          />
        )}

        {activeTab === 'security' && (
          <SecurityComplianceSuite
            auditLogs={auditLogs}
            security={security}
            onRotateKeys={handleRotateKeys}
            onUpdateRole={(newRole) => setSecurity(prev => ({ ...prev, activeStaffRole: newRole }))}
            onLogAuditEvent={logAuditEvent}
          />
        )}
      </main>

      {/* Mobile Staff & Guest Companion Simulator Modal */}
      {mobileModalState.isOpen && (
        <MobileCompanionModal
          initialMode={mobileModalState.mode}
          initialRoomNumber={mobileModalState.roomNumber}
          rooms={rooms}
          guests={guests}
          folios={folios}
          onClose={() => setMobileModalState({ isOpen: false, mode: 'staff' })}
          onUpdateRoomStatus={handleUpdateRoomStatus}
          onToggleDoorLock={handleToggleDoorLock}
          onAddFolioCharge={handleAddFolioCharge}
          onLogAuditEvent={logAuditEvent}
        />
      )}

      {/* New Reservation Modal */}
      {isNewReservationOpen && (
        <NewReservationModal
          rooms={rooms}
          initialRoomNumber={reservationPresetRoom}
          onClose={() => setIsNewReservationOpen(false)}
          onCreateReservation={handleCreateReservation}
        />
      )}

      {/* MFA & Role Management Modal */}
      {isMfaModalOpen && (
        <MfaModal
          security={security}
          onClose={() => setIsMfaModalOpen(false)}
          onUpdateRole={(newRole) => setSecurity(prev => ({ ...prev, activeStaffRole: newRole }))}
          onRotateKeys={handleRotateKeys}
        />
      )}

      {/* Subtle Corporate Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">ApexStay Hospitality Cloud</span>
            <span>·</span>
            <span>PCI-DSS Level 1 & GDPR Certified</span>
            <span>·</span>
            <span className="font-mono text-emerald-400">E2EE HSM Active</span>
          </div>
          <div>
            <span>© 2026 ApexStay Global Operations. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
