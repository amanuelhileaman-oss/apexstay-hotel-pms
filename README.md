# ApexStay Hospitality Cloud (SaaS Hotel Management System)

Enterprise SaaS Hotel Management System with real-time room inventory, guest CRM analytics, automated billing, channel manager booking engine sync, mobile staff/guest portals, E2EE security, MFA, and GDPR/CCPA audit governance.

---

## Features

- **Property Oversight Dashboard**: Real-time Occupancy, RevPAR, ADR, Daily Room Yield, and 7-day projection trends.
- **Real-Time Room Inventory Grid**: Interactive floor-by-floor room grid (Floors 1–4, Penthouses, Presidential suites) with IoT deadbolt lock status and HVAC temperature telemetry.
- **Guest Intelligence & CRM**: Loyalty tier distribution (Platinum Elite, Gold VIP, Silver, Standard), lifetime spend, guest preferences, and masked/encrypted PII.
- **GDPR & CCPA Privacy Suite**: Automated Article 15 Subject Access Request (SAR) JSON generator and Article 17 "Right to be Forgotten" cryptographic erasure.
- **Automated Billing & Night Audit**: Itemized room folios (Room Charges, Dining, Spa, Tourism Taxes) with 1-click batch night audit reconciliation.
- **Channel Manager & Booking Engines**: 2-way rate parity synchronization with Booking.com, Expedia, Airbnb, Direct Engine, and GDS, plus real-time webhook booking simulation.
- **Payment Gateways**: Integrated with Stripe Connect, Adyen Global Settlement, and Apple Pay Terminal.
- **Mobile-First Companion**:
  - **Staff Companion**: Housekeeping triage, turnaround checklist, and mobile room inspection.
  - **Guest Digital Key**: NFC/Bluetooth digital door key reader simulation, in-room service requests, and live folio settlement.
- **Security & Cryptography**:
  - Client-side and storage-level **End-to-End Encryption (AES-256-GCM / RSA-4096)** with live key rotation.
  - **Multi-Factor Authentication (MFA)** enforced for all staff roles with live TOTP token generation.
  - **Immutable Administrative Audit Log**: Chronological tamper-evident tracking with SHA-256 integrity hashes and CSV export.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite
- **Icons & Motion**: Lucide React, Motion
- **Architecture**: Modular domain components, responsive desktop SaaS + mobile-first companion

---

## Local Development

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Build for production
npm run build
```

---

## Production Deployment

### Docker / Cloud Run
```bash
docker build -t apexstay-hotel-pms .
docker run -p 3000:3000 apexstay-hotel-pms
```

### Vercel / Netlify
1. Import repository `amanuelhileaman-oss/apexstay-hotel-pms` in Vercel or Netlify.
2. Build command: `npm run build`
3. Output directory: `dist`
