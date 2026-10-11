export type RoomCategory =
  | 'Deluxe King'
  | 'Executive Suite'
  | 'Ocean Penthouse'
  | 'Junior Suite'
  | 'Presidential Suite';

export type RoomStatus =
  | 'Occupied'
  | 'Vacant Clean'
  | 'Vacant Dirty'
  | 'Cleaning'
  | 'Reserved'
  | 'Maintenance';

export interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  category: RoomCategory;
  status: RoomStatus;
  nightRate: number;
  guestName?: string;
  guestId?: string;
  checkIn?: string;
  checkOut?: string;
  occupants: number;
  doorLocked: boolean;
  temperature: number;
  features: string[];
  housekeeperAssigned?: string;
  cleaningPriority: 'High' | 'Normal' | 'Low';
  notes?: string;
}

export type LoyaltyTier = 'Platinum Elite' | 'Gold VIP' | 'Silver' | 'Standard';

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  tier: LoyaltyTier;
  lifetimeSpend: number;
  staysCount: number;
  loyaltyPoints: number;
  currentRoom?: string;
  preferences: {
    pillowType: string;
    floorPreference: string;
    dietary: string;
    lateCheckoutRequested: boolean;
    quietRoom: boolean;
  };
  maskedPassport: string;
  maskedCreditCard: string;
  encryptedPiiToken: string;
  gdprConsentDate: string;
  ccpaOptOut: boolean;
}

export type ChargeCategory =
  | 'Room Charge'
  | 'Dining & Minibar'
  | 'Spa & Wellness'
  | 'Resort Fee'
  | 'Tourism Tax'
  | 'Late Checkout';

export interface FolioItem {
  id: string;
  guestId: string;
  roomNumber: string;
  category: ChargeCategory;
  description: string;
  amount: number;
  timestamp: string;
  status: 'Posted' | 'Settled' | 'Disputed' | 'Pending';
  paymentMethod?: string;
}

export interface BookingChannel {
  id: string;
  name: string;
  logo: string;
  type: 'OTA' | 'Direct Engine' | 'GDS' | 'Payment Gateway';
  status: 'Connected' | 'Syncing' | 'Error' | 'Paused';
  lastSync: string;
  inventorySyncActive: boolean;
  rateMultiplier: number; // e.g. 1.0 = base, 1.15 = +15% OTA markup
  activeListingsCount: number;
  bookingsThisMonth: number;
  revenueThisMonth: number;
}

export type AuditSeverity = 'INFO' | 'WARNING' | 'CRITICAL_BLOCKED';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: 'System' | 'Hotel General Manager' | 'Front Desk Lead' | 'Housekeeping Lead' | 'Financial Controller';
  actionType:
    | 'AUTH_LOGIN'
    | 'MFA_CHALLENGE'
    | 'PII_DECRYPT'
    | 'FOLIO_ADJUSTMENT'
    | 'NIGHT_AUDIT_RUN'
    | 'RATE_OVERRIDE'
    | 'ROOM_STATUS_CHANGE'
    | 'GDPR_FORGET_REQUEST'
    | 'SECURITY_KEY_ROTATION'
    | 'OTA_SYNC_TRIGGERED';
  ipAddress: string;
  location: string;
  severity: AuditSeverity;
  details: string;
  cryptoHash: string;
}

export interface SecurityStatus {
  e2eeEnabled: boolean;
  encryptionAlgorithm: string;
  activeKeyVersion: string;
  mfaEnforced: boolean;
  gdprCompliant: boolean;
  ccpaCompliant: boolean;
  activeStaffRole: 'Hotel General Manager' | 'Front Desk Lead' | 'Housekeeping Lead' | 'Financial Controller';
}
