import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  X, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Wifi, 
  Sparkles, 
  Coffee, 
  KeyRound, 
  Receipt,
  Smartphone,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { Room } from '../../types/hotel';

interface RoomQrModalProps {
  room: Room;
  onClose: () => void;
  onOpenGuestPortal: (roomNumber: string) => void;
}

export const RoomQrModal: React.FC<RoomQrModalProps> = ({
  room,
  onClose,
  onOpenGuestPortal,
}) => {
  const [copied, setCopied] = useState(false);

  // Generate authentic in-room guest portal URL
  const portalUrl = `${window.location.origin}/?room=${room.roomNumber}&portal=guest&token=apex_${room.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(portalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadSvg = () => {
    const svgElement = document.getElementById('room-qr-svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ApexStay_Room_${room.roomNumber}_Guest_QR.svg`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 sm:p-7 space-y-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>Room {room.roomNumber} Digital Concierge QR</span>
                <span className="text-xs font-mono font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  {room.category}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                In-room nightstand & keycard QR code for automated folio review and guest service requests.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Acrylic Standee / In-Room Placard Physical Mockup */}
        <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-400/40 rounded-2xl p-6 shadow-xl relative overflow-hidden text-center">
          {/* Subtle Decorative Hospitality Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-12 bg-amber-400/10 blur-xl pointer-events-none" />

          {/* Standee Header */}
          <div className="mb-4">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-400 block">
              ApexStay Hospitality Cloud
            </span>
            <div className="text-2xl font-bold font-mono text-slate-100 mt-1">
              Room {room.roomNumber}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Welcome, {room.guestName || 'Valued Guest'}
            </p>
          </div>

          {/* High-Resolution Scannable QR Code */}
          <div className="inline-block bg-white p-4 rounded-2xl shadow-lg border-4 border-amber-400/20">
            <QRCodeSVG
              id="room-qr-svg"
              value={portalUrl}
              size={180}
              level="H"
              includeMargin={false}
              bgColor="#ffffff"
              fgColor="#020617"
            />
          </div>

          {/* Scan Instructions */}
          <p className="text-xs font-medium text-slate-300 mt-4 max-w-sm mx-auto">
            Scan with your phone camera for your instant digital room folio, 24/7 room service, and NFC digital room key.
          </p>

          {/* Wi-Fi & Concierge Badges Strip */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-3 text-left text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-slate-300">
              <Wifi className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Complimentary Wi-Fi</span>
                <span className="font-mono text-xs font-semibold text-slate-200">Apex_Guest_5G</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Digital Security</span>
                <span className="font-mono text-xs font-semibold text-slate-200">E2EE Protected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-400">
          <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
            <Receipt className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <span className="font-medium text-slate-200 block text-[11px]">Real-Time Folio</span>
            <span className="text-[10px]">Itemized bill & charges</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
            <Coffee className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <span className="font-medium text-slate-200 block text-[11px]">In-Room Orders</span>
            <span className="text-[10px]">Breakfast, spa & towels</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
            <KeyRound className="w-4 h-4 text-sky-400 mx-auto mb-1" />
            <span className="font-medium text-slate-200 block text-[11px]">Mobile Key</span>
            <span className="text-[10px]">Deadbolt NFC unlocking</span>
          </div>
        </div>

        {/* Direct Link Copier Bar */}
        <div className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          <span className="font-mono text-slate-400 truncate flex-1 px-2 select-all text-[11px]">
            {portalUrl}
          </span>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy URL</span>
              </>
            )}
          </button>
        </div>

        {/* Bottom Actions */}
        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Print Acrylic Stand</span>
            </button>
            <button
              onClick={handleDownloadSvg}
              className="px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Download SVG</span>
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenGuestPortal(room.roomNumber);
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm shadow-amber-400/20 cursor-pointer"
          >
            <Smartphone className="w-4 h-4" />
            <span>Test Guest Portal Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
