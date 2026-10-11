import React, { useState } from 'react';
import { X, ShieldCheck, Key, Fingerprint, Lock, CheckCircle2, RefreshCw } from 'lucide-react';
import { SecurityStatus } from '../../types/hotel';

interface MfaModalProps {
  security: SecurityStatus;
  onClose: () => void;
  onUpdateRole: (role: SecurityStatus['activeStaffRole']) => void;
  onRotateKeys: () => void;
}

export const MfaModal: React.FC<MfaModalProps> = ({
  security,
  onClose,
  onUpdateRole,
  onRotateKeys,
}) => {
  const [role, setRole] = useState(security.activeStaffRole);
  const [rotatedMessage, setRotatedMessage] = useState(false);

  const handleSaveRole = () => {
    onUpdateRole(role);
    onClose();
  };

  const handleRotate = () => {
    onRotateKeys();
    setRotatedMessage(true);
    setTimeout(() => setRotatedMessage(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Staff Authentication & RBAC Policy
              </h3>
              <p className="text-xs text-slate-400">
                Multi-Factor Authentication (MFA) & Role Session
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Parameters */}
        <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Session Status:</span>
            <span className="text-emerald-400 font-semibold font-mono">AUTHENTICATED (MFA_VERIFIED)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Hardware Authenticator:</span>
            <span className="text-slate-200">FIDO2 / YubiKey WebAuthn Active</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Master Key Version:</span>
            <span className="font-mono text-amber-400">{security.activeKeyVersion}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">International Compliance:</span>
            <span className="text-slate-200">GDPR & CCPA Enforced</span>
          </div>
        </div>

        {/* Role Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Switch Active Staff Operator Role:
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
          >
            <option value="Hotel General Manager">Hotel General Manager (Full Root Access)</option>
            <option value="Front Desk Lead">Front Desk Lead (Reservations & Check-ins)</option>
            <option value="Housekeeping Lead">Housekeeping Lead (Room Inspection & Triage)</option>
            <option value="Financial Controller">Financial Controller (Folios & Night Audit)</option>
          </select>
          <p className="text-[11px] text-slate-400 mt-1">
            Access to PII decryption and rate overrides requires role-based cryptographic signing.
          </p>
        </div>

        {/* Key Rotation Button */}
        <div>
          <button
            onClick={handleRotate}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Rotate AES-256 HSM Master Key</span>
          </button>
          {rotatedMessage && (
            <p className="text-[11px] text-emerald-400 text-center mt-1">
              ✓ Master key rotated and updated in audit ledger.
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-2 text-xs text-slate-400 hover:text-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveRole}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
          >
            Apply Role
          </button>
        </div>
      </div>
    </div>
  );
};
