import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Download, 
  Trash2, 
  Crown, 
  HeartHandshake, 
  Globe, 
  FileText,
  Calendar,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  X
} from 'lucide-react';
import { Guest, LoyaltyTier } from '../../types/hotel';
import { exportSarReport } from '../../services/securityService';

interface GuestAnalyticsViewProps {
  guests: Guest[];
  onLogAuditEvent: (actionType: any, details: string, severity?: any) => void;
  onForgetGuest: (guestId: string, guestName: string) => void;
}

export const GuestAnalyticsView: React.FC<GuestAnalyticsViewProps> = ({
  guests,
  onLogAuditEvent,
  onForgetGuest,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<LoyaltyTier | 'all'>('all');
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [decryptedPiiGuestId, setDecryptedPiiGuestId] = useState<string | null>(null);
  const [mfaChallengeModalGuest, setMfaChallengeModalGuest] = useState<Guest | null>(null);
  const [mfaInputCode, setMfaInputCode] = useState('');
  const [sarReportContent, setSarReportContent] = useState<string | null>(null);

  // Aggregate metrics
  const totalGuests = guests.length;
  const totalLifetimeSpend = guests.reduce((acc, g) => acc + g.lifetimeSpend, 0);
  const avgLifetimeSpend = totalGuests > 0 ? (totalLifetimeSpend / totalGuests).toFixed(0) : '0';
  const platinumCount = guests.filter(g => g.tier === 'Platinum Elite').length;
  const goldCount = guests.filter(g => g.tier === 'Gold VIP').length;

  const filteredGuests = guests.filter(guest => {
    if (tierFilter !== 'all' && guest.tier !== tierFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = guest.name.toLowerCase().includes(q);
      const matchEmail = guest.email.toLowerCase().includes(q);
      const matchCountry = guest.country.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchCountry) return false;
    }
    return true;
  });

  const handleTriggerDecryptPii = (guest: Guest) => {
    // Open MFA confirmation modal before decrypting sensitive PII
    setMfaChallengeModalGuest(guest);
    setMfaInputCode('');
  };

  const handleConfirmDecrypt = () => {
    if (!mfaChallengeModalGuest) return;
    setDecryptedPiiGuestId(mfaChallengeModalGuest.id);
    onLogAuditEvent(
      'PII_DECRYPT',
      `Decrypted restricted passport & payment token for guest ${mfaChallengeModalGuest.name} (${mfaChallengeModalGuest.id}) under GDPR Art. 6(1)(c).`,
      'WARNING'
    );
    setMfaChallengeModalGuest(null);
  };

  const handleGenerateSar = (guest: Guest) => {
    const report = exportSarReport(guest.name, guest.email, {
      id: guest.id,
      phone: guest.phone,
      country: guest.country,
      tier: guest.tier,
      lifetimeSpend: guest.lifetimeSpend,
      staysCount: guest.staysCount,
      preferences: guest.preferences,
      gdprConsentDate: guest.gdprConsentDate,
      ccpaOptOut: guest.ccpaOptOut,
    });
    setSarReportContent(report);
    onLogAuditEvent(
      'PII_DECRYPT',
      `Generated GDPR Article 15 Subject Access Request (SAR) payload for ${guest.name}.`,
      'INFO'
    );
  };

  return (
    <div className="space-y-6">
      {/* Editorial Title & Overview */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Guest Intelligence & CRM Analytics
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Data-driven loyalty insights, automated preference tracking, and GDPR/CCPA privacy controls.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-400 bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>GDPR Art. 17 & CCPA §1798 Compliant</span>
          </div>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total CRM Profiles</span>
            <Users className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono tabular-nums">
            {totalGuests}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            <span>Verified international profiles</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Avg. Lifetime Value</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono tabular-nums">
            ${Number(avgLifetimeSpend).toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            <span>Across all stay histories</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Elite VIP Density</span>
            <Crown className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums">
            {platinumCount} <span className="text-xs font-normal text-slate-400">Platinum</span>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            <span>+{goldCount} Gold VIP tier guests</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Avg. Length of Stay</span>
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono tabular-nums">
            4.2 <span className="text-xs font-normal text-slate-400">nights</span>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            <span>Lead booking window: 19.4 days</span>
          </div>
        </div>
      </div>

      {/* Directory Search & Filter Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Tier filter tabs */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg w-full sm:w-auto overflow-x-auto">
          {(['all', 'Platinum Elite', 'Gold VIP', 'Silver', 'Standard'] as const).map(tier => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                tierFilter === tier
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tier === 'all' ? 'All Tiers' : tier}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or country..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Guest Ledger Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Guest & Origin</th>
                <th className="py-3 px-4">Loyalty Tier</th>
                <th className="py-3 px-4">Current Room</th>
                <th className="py-3 px-4 text-right">Lifetime Spend</th>
                <th className="py-3 px-4 text-right">Past Stays</th>
                <th className="py-3 px-4">Encrypted Identity (E2EE)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredGuests.map(guest => {
                const isDecrypted = decryptedPiiGuestId === guest.id;
                return (
                  <tr key={guest.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Name & Origin */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-100 text-sm">{guest.name}</div>
                      <div className="text-slate-400 text-xs flex items-center gap-1.5 mt-0.5">
                        <span>{guest.email}</span>
                        <span>·</span>
                        <span>{guest.country}</span>
                      </div>
                    </td>

                    {/* Tier */}
                    <td className="py-3 px-4">
                      <span className={`font-semibold ${
                        guest.tier === 'Platinum Elite' ? 'text-amber-400' :
                        guest.tier === 'Gold VIP' ? 'text-yellow-300' : 'text-slate-300'
                      }`}>
                        {guest.tier}
                      </span>
                      <span className="block text-[11px] text-slate-400 font-mono tabular-nums">
                        {guest.loyaltyPoints.toLocaleString()} pts
                      </span>
                    </td>

                    {/* Current Room */}
                    <td className="py-3 px-4">
                      {guest.currentRoom ? (
                        <span className="font-mono font-bold text-emerald-400">
                          Room {guest.currentRoom}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Not in-house</span>
                      )}
                    </td>

                    {/* Lifetime Spend */}
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-100 tabular-nums">
                      ${guest.lifetimeSpend.toLocaleString()}
                    </td>

                    {/* Past Stays */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-300">
                      {guest.staysCount} stays
                    </td>

                    {/* Encrypted PII Fields with Decrypt Toggle */}
                    <td className="py-3 px-4">
                      {isDecrypted ? (
                        <div className="bg-emerald-950/40 border border-emerald-800/80 rounded p-1.5 text-[11px] font-mono text-emerald-300 space-y-0.5">
                          <div>Passport: {guest.country.substring(0, 2).toUpperCase()}-94810294</div>
                          <div>Card: 4111 •••• •••• 9014 (Exp 12/28)</div>
                          <span className="text-[10px] text-emerald-400 block">✓ MFA Verified Audit Trail</span>
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-400 space-y-0.5">
                          <div className="font-mono">{guest.maskedPassport}</div>
                          <div className="font-mono">{guest.maskedCreditCard}</div>
                          <button
                            onClick={() => handleTriggerDecryptPii(guest)}
                            className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold text-[10px] cursor-pointer mt-0.5"
                          >
                            <Lock className="w-3 h-3" />
                            <span>MFA Decrypt PII</span>
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedGuest(guest)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors cursor-pointer"
                        >
                          Profile & Notes
                        </button>
                        <button
                          onClick={() => handleGenerateSar(guest)}
                          title="Generate GDPR Art. 15 Subject Access Report"
                          className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guest Detail & Preference Modal */}
      {selectedGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-100">{selectedGuest.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedGuest.tier} · {selectedGuest.country} · Member #{selectedGuest.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedGuest(null)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* In-Room Preferences */}
            <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
                <span>Guest Hospitality Preferences & Diet</span>
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Pillow Type</span>
                  <span className="text-slate-200 font-medium">{selectedGuest.preferences.pillowType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Floor Selection</span>
                  <span className="text-slate-200 font-medium">{selectedGuest.preferences.floorPreference}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Dietary & Refreshment</span>
                  <span className="text-slate-200 font-medium">{selectedGuest.preferences.dietary}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Late Checkout</span>
                  <span className="text-slate-200 font-medium">
                    {selectedGuest.preferences.lateCheckoutRequested ? 'Requested (14:00)' : 'Standard (11:00)'}
                  </span>
                </div>
              </div>
            </div>

            {/* GDPR & CCPA Compliance Console */}
            <div className="border border-slate-800 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Data Privacy & Regulatory Governance</span>
              </h4>
              <div className="text-xs text-slate-400 space-y-1">
                <p>• GDPR Article 6 Consent Logged: {selectedGuest.gdprConsentDate}</p>
                <p>• CCPA Do-Not-Sell/Share Status: {selectedGuest.ccpaOptOut ? 'Opted Out' : 'Active Standard'}</p>
                <p className="font-mono text-[11px] text-slate-400">
                  Encrypted Key Token: {selectedGuest.encryptedPiiToken}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => {
                    handleGenerateSar(selectedGuest);
                    setSelectedGuest(null);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Article 15 SAR Payload</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Execute GDPR Article 17 "Right to be Forgotten" for ${selectedGuest.name}? This will anonymize identity records.`)) {
                      onForgetGuest(selectedGuest.id, selectedGuest.name);
                      setSelectedGuest(null);
                    }
                  }}
                  className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Erase Data (Right to Be Forgotten)</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedGuest(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MFA Security Challenge Prompt Modal */}
      {mfaChallengeModalGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  MFA Authorization Required
                </h3>
                <p className="text-xs text-slate-400">
                  Accessing unmasked passport & credit card data for {mfaChallengeModalGuest.name}.
                </p>
              </div>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-lg text-xs text-slate-300 space-y-1">
              <p className="font-semibold text-amber-300">Security Invariant:</p>
              <p>Under GDPR Art. 32 and CCPA requirements, unmasking PII requires active multi-factor authentication. An immutable entry will be appended to the administrative audit log.</p>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Enter 6-digit Authenticator TOTP or Staff Master Code:
              </label>
              <input
                type="text"
                value={mfaInputCode}
                onChange={(e) => setMfaInputCode(e.target.value)}
                placeholder="e.g. 849201"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-center font-mono text-base tracking-widest text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                (Simulation: Any 6 digits or click Verify below to authenticate with active session key)
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setMfaChallengeModalGuest(null)}
                className="px-3.5 py-2 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDecrypt}
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
              >
                Authenticate & Decrypt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SAR Download / Inspection Modal */}
      {sarReportContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>GDPR Art. 15 Subject Access Request (SAR) Payload</span>
              </h3>
              <button
                onClick={() => setSarReportContent(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Cryptographically signed data export ready for transmission to the data subject under EU GDPR and California CCPA guidelines.
            </p>

            <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-emerald-400 max-h-72 overflow-y-auto border border-slate-800">
              {sarReportContent}
            </pre>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  const blob = new Blob([sarReportContent], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `sar_export_${Date.now()}.json`;
                  a.click();
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-emerald-400 hover:bg-emerald-300 text-slate-950 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON File</span>
              </button>
              <button
                onClick={() => setSarReportContent(null)}
                className="px-4 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
