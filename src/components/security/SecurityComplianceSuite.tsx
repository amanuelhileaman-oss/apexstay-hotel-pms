import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  FileText, 
  Download, 
  Filter, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Fingerprint, 
  Layers,
  Database,
  History,
  Check
} from 'lucide-react';
import { AuditLogEntry, SecurityStatus, AuditSeverity } from '../../types/hotel';

interface SecurityComplianceSuiteProps {
  auditLogs: AuditLogEntry[];
  security: SecurityStatus;
  onRotateKeys: () => void;
  onUpdateRole: (role: SecurityStatus['activeStaffRole']) => void;
  onLogAuditEvent: (actionType: any, details: string, severity?: AuditSeverity) => void;
}

export const SecurityComplianceSuite: React.FC<SecurityComplianceSuiteProps> = ({
  auditLogs,
  security,
  onRotateKeys,
  onUpdateRole,
  onLogAuditEvent,
}) => {
  const [severityFilter, setSeverityFilter] = useState<AuditSeverity | 'all'>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sandboxPlaintext, setSandboxPlaintext] = useState('GUEST_PASSPORT: FR-882194 | EXP: 2031-08-12');
  const [sandboxCiphertext, setSandboxCiphertext] = useState('aes256gcm:990cb28810fe64bcf1092a:tag819f');
  const [totpRemainingSec, setTotpRemainingSec] = useState(24);
  const [currentTotpCode, setCurrentTotpCode] = useState('892 410');
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Live TOTP countdown simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTotpRemainingSec(prev => {
        if (prev <= 1) {
          // Regenerate 6-digit code
          const newCode = Math.floor(100000 + Math.random() * 900000).toString();
          setCurrentTotpCode(`${newCode.slice(0, 3)} ${newCode.slice(3)}`);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredLogs = auditLogs.filter(log => {
    if (severityFilter !== 'all' && log.severity !== severityFilter) return false;
    if (roleFilter !== 'all' && log.actorRole !== roleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchActor = log.actorName.toLowerCase().includes(q);
      const matchDetails = log.details.toLowerCase().includes(q);
      const matchIp = log.ipAddress.toLowerCase().includes(q);
      const matchAction = log.actionType.toLowerCase().includes(q);
      if (!matchActor && !matchDetails && !matchIp && !matchAction) return false;
    }
    return true;
  });

  const handleExportCsv = () => {
    const headers = 'ID,Timestamp,Actor,Role,ActionType,IP,Location,Severity,Details,CryptoHash\n';
    const rows = filteredLogs.map(l => 
      `"${l.id}","${l.timestamp}","${l.actorName}","${l.actorRole}","${l.actionType}","${l.ipAddress}","${l.location}","${l.severity}","${l.details.replace(/"/g, '""')}","${l.cryptoHash}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apexstay_audit_trail_${Date.now()}.csv`;
    a.click();

    onLogAuditEvent(
      'PII_DECRYPT',
      `Exported administrative audit trail CSV (${filteredLogs.length} records) for compliance inspection.`,
      'INFO'
    );
  };

  const handleEncryptSandbox = () => {
    const mockCipher = `aes256gcm:${Math.random().toString(16).substring(2, 16)}:${Math.random().toString(16).substring(2, 10)}`;
    setSandboxCiphertext(mockCipher);
  };

  return (
    <div className="space-y-6">
      {/* Title & Security Posture */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Security, Cryptography & Compliance Governance
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            End-to-End Encryption (E2EE), Multi-Factor Authentication (MFA), GDPR/CCPA enforcement, and immutable administrative audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export Audit Trail (CSV)</span>
          </button>
          <button
            onClick={onRotateKeys}
            className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-amber-400/20 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Rotate Master Cryptographic Key</span>
          </button>
        </div>
      </div>

      {/* 3 Pillars of Data Protection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Pillar 1: End-to-End Encryption (E2EE) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-semibold text-slate-100">
                End-to-End Encryption (E2EE)
              </h2>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
              ACTIVE
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Cipher Specification:</span>
              <span className="font-mono text-slate-200">{security.encryptionAlgorithm}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Active Key Ring:</span>
              <span className="font-mono text-amber-400 font-semibold">{security.activeKeyVersion}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">PII At-Rest Storage:</span>
              <span className="text-emerald-400">Hardware HSM Encrypted</span>
            </div>
          </div>

          {/* Interactive Cryptographic Inspector Sandbox */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Cryptographic Inspection Sandbox</span>
              <button
                onClick={handleEncryptSandbox}
                className="text-amber-400 hover:text-amber-300 text-[10px] cursor-pointer"
              >
                Re-encrypt
              </button>
            </div>
            <input
              type="text"
              value={sandboxPlaintext}
              onChange={(e) => setSandboxPlaintext(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-[11px] font-mono text-slate-200 focus:outline-none"
            />
            <div className="p-1.5 bg-slate-950 rounded text-[10px] font-mono text-emerald-400 break-all border border-slate-800">
              {sandboxCiphertext}
            </div>
          </div>
        </div>

        {/* Pillar 2: Multi-Factor Authentication (MFA) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Fingerprint className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-semibold text-slate-100">
                Multi-Factor Authentication (MFA)
              </h2>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
              ENFORCED
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Enforcement Policy:</span>
              <span className="text-slate-200">100% Staff & Admins</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Hardware Protocols:</span>
              <span className="text-slate-200">FIDO2 / WebAuthn & TOTP</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Active Staff Role:</span>
              <select
                value={security.activeStaffRole}
                onChange={(e) => onUpdateRole(e.target.value as any)}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded px-1.5 py-0.5 focus:outline-none"
              >
                <option value="Hotel General Manager">General Manager</option>
                <option value="Front Desk Lead">Front Desk Lead</option>
                <option value="Housekeeping Lead">Housekeeping Lead</option>
                <option value="Financial Controller">Financial Controller</option>
              </select>
            </div>
          </div>

          {/* Live TOTP Authenticator Ring Simulation */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-lg p-3 text-center space-y-1">
            <span className="text-[11px] text-slate-400 block">
              Active TOTP Authenticator Token ({totpRemainingSec}s)
            </span>
            <div className="text-2xl font-mono font-bold text-amber-400 tracking-wider">
              {currentTotpCode}
            </div>
            <span className="text-[10px] text-slate-400 block">
              Time-based One-Time Password RFC 6238
            </span>
          </div>
        </div>

        {/* Pillar 3: GDPR & CCPA Compliance Suite */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-semibold text-slate-100">
                GDPR & CCPA Standards
              </h2>
            </div>
            <span className="text-xs font-mono text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded border border-sky-400/20">
              COMPLIANT
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Right to be Forgotten:</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Automated Erasure
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Article 15 SAR Export:</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> JSON / Crypto Signed
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">CCPA Do-Not-Sell:</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Zero Data Brokering
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Data Retention:</span>
              <span className="text-slate-200">7-yr tax / 90d telemetry</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
            Registered DPO: <span className="text-slate-300 font-mono">dpo@apexstay.internal</span>. All access requests cryptographically signed.
          </div>
        </div>
      </div>

      {/* Immutable Administrative Audit Log System */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <History className="w-4 h-4 text-amber-400" />
              <span>Immutable Administrative Access & Audit Log System</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Chronological cryptographic ledger tracking all administrative access attempts, role challenges, and sensitive data changes.
            </p>
          </div>

          <span className="text-xs font-mono text-slate-400">
            {filteredLogs.length} Entries Logged
          </span>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 pb-1 border-t border-slate-800">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Severity Filter */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
              {(['all', 'INFO', 'WARNING', 'CRITICAL_BLOCKED'] as const).map(sev => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    severityFilter === sev
                      ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sev === 'all' ? 'All Severities' : sev}
                </button>
              ))}
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="System">System Daemons</option>
              <option value="Hotel General Manager">General Manager</option>
              <option value="Front Desk Lead">Front Desk Lead</option>
              <option value="Financial Controller">Financial Controller</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search actor, IP, or details..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Timestamp (UTC)</th>
                <th className="py-2.5 px-3">Actor & Role</th>
                <th className="py-2.5 px-3">Action Type</th>
                <th className="py-2.5 px-3">IP & Location</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Audit Details</th>
                <th className="py-2.5 px-3 font-mono">Crypto SHA-256</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 text-slate-400 font-mono tabular-nums whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-200">{log.actorName}</div>
                    <div className="text-[11px] text-slate-400">{log.actorRole}</div>
                  </td>
                  <td className="py-3 px-3 font-mono text-amber-300 font-semibold whitespace-nowrap">
                    {log.actionType}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-300">
                    <div>{log.ipAddress}</div>
                    <div className="text-slate-400 font-sans">{log.location}</div>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                      log.severity === 'CRITICAL_BLOCKED'
                        ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                        : log.severity === 'WARNING'
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-200 max-w-xs">
                    {log.details}
                  </td>
                  <td className="py-3 px-3 font-mono text-[10px] text-slate-400 tabular-nums whitespace-nowrap">
                    {log.cryptoHash.slice(0, 18)}...
                  </td>
                </tr>
              ))}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No audit records match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
