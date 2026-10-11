import { AuditLogEntry, AuditSeverity } from '../types/hotel';

// Simple fast deterministic hash simulation for immutable audit log integrity
export function generateCryptoHash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  const salt = Math.abs((hash ^ 0x5f3759df)).toString(16).padStart(8, '0');
  return `sha256:${hex}${salt}c891...`;
}

export function createAuditLogEntry(
  actorName: string,
  actorRole: AuditLogEntry['actorRole'],
  actionType: AuditLogEntry['actionType'],
  details: string,
  severity: AuditSeverity = 'INFO',
  ipAddress = '192.168.1.104',
  location = 'Admin Console (Secured)'
): AuditLogEntry {
  const now = new Date();
  const timestamp = now.toISOString().replace('T', ' ').substring(0, 23);
  const id = `aud-${Math.floor(1000 + Math.random() * 9000)}`;
  const rawPayload = `${id}|${timestamp}|${actorName}|${actorRole}|${actionType}|${details}`;
  const cryptoHash = generateCryptoHash(rawPayload);

  return {
    id,
    timestamp,
    actorName,
    actorRole,
    actionType,
    ipAddress,
    location,
    severity,
    details,
    cryptoHash,
  };
}

export function simulateMfaCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function exportSarReport(guestName: string, guestEmail: string, piiData: Record<string, unknown>): string {
  return JSON.stringify(
    {
      complianceStandard: 'GDPR Article 15 (Right of Access) & CCPA § 1798.100',
      dataSubject: {
        name: guestName,
        email: guestEmail,
        requestDate: new Date().toISOString(),
      },
      controller: {
        entity: 'ApexStay Hospitality Cloud SAS',
        dpoContact: 'dpo@apexstay.internal',
        jurisdiction: 'EU/EEA & California, USA',
      },
      retentionPolicy: {
        financialLedger: '7 years statutory retention (Tax & VAT compliance)',
        behavioralTelemetry: 'Anonymized after 90 days',
        roomKeyCredentials: 'Revoked instantly at checkout',
      },
      piiInventory: piiData,
      cryptographicSignature: generateCryptoHash(guestName + guestEmail + Date.now().toString()),
    },
    null,
    2
  );
}
