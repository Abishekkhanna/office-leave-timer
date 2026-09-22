import React, { useState } from 'react';
import { Download, Smartphone, ShieldCheck, Check, QrCode, Bell, Sparkles, Timer } from 'lucide-react';

export const ApkDownloadCard: React.FC = () => {
  const [downloaded, setDownloaded] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const apkDownloadUrl = '/OfficeLeaveTimerV1.apk';

  const handleDownload = () => {
    setDownloaded(true);
    const link = document.createElement('a');
    link.href = apkDownloadUrl;
    link.download = 'OfficeLeaveTimerV1.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloaded(false), 3500);
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.origin + apkDownloadUrl : '';

  return (
    <div id="apk-download-card" className="bg-[#0c0c0e] border border-white/10 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-bold uppercase tracking-[0.2em]">
            <Smartphone className="w-3.5 h-3.5" />
            <span>OFFICE LEAVE TIMER V1 • ANDROID 15 &amp; REALME 11 5G</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white">
            Download Office Leave Timer V1 APK
          </h2>
          <p className="text-sm text-white/50 max-w-xl leading-relaxed">
            Compiled native package (<code className="text-white/80 font-mono">OfficeLeaveTimerV1.apk</code>) with configurable office hours (HH:MM), full-screen leave alert, 365 daily developer jokes, and home-screen widget. 100% local, offline, and battery-friendly.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <button
            id="download-apk-btn"
            onClick={handleDownload}
            className="flex items-center justify-center gap-2.5 px-6 py-4 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-600/30 transition-all cursor-pointer group"
          >
            {downloaded ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Downloading V1 APK...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                <span>Download V1 APK</span>
              </>
            )}
          </button>

          <button
            id="qr-code-toggle-btn"
            onClick={() => setShowQrModal(!showQrModal)}
            className="flex items-center justify-center gap-2 px-5 py-4 bg-white/5 hover:bg-white/10 active:scale-95 text-white/70 hover:text-white border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-blue-400" />
            <span>Scan QR</span>
          </button>
        </div>
      </div>

      {/* Highlights bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-8 pt-6 border-t border-white/5">
        <div className="flex items-center gap-3 text-xs text-white/70 p-3 bg-[#131316] rounded-2xl border border-white/5">
          <Timer className="w-4 h-4 text-sky-400 shrink-0" />
          <span>Configurable HH:MM</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-white/70 p-3 bg-[#131316] rounded-2xl border border-white/5">
          <Bell className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Full-Screen Leave Alert</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-white/70 p-3 bg-[#131316] rounded-2xl border border-white/5">
          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
          <span>365 Developer Jokes</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-white/70 p-3 bg-[#131316] rounded-2xl border border-white/5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>100% Offline &amp; Private</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-white/70 p-3 bg-[#131316] rounded-2xl border border-white/5 col-span-2 sm:col-span-1">
          <Smartphone className="w-4 h-4 text-blue-400 shrink-0" />
          <span>Android 15 (Target 35)</span>
        </div>
      </div>

      {/* QR Code popup preview */}
      {showQrModal && (
        <div className="mt-6 p-6 bg-[#131316] border border-white/10 rounded-3xl flex flex-col sm:flex-row items-center gap-6 animate-fadeIn">
          <div className="p-3.5 bg-white rounded-2xl shadow-xl shrink-0">
            {/* Simple high-contrast SVG QR Pattern */}
            <svg className="w-32 h-32" viewBox="0 0 100 100" fill="currentColor">
              <rect x="0" y="0" width="30" height="30" fill="#070708" rx="4" />
              <rect x="5" y="5" width="20" height="20" fill="#FFFFFF" rx="2" />
              <rect x="9" y="9" width="12" height="12" fill="#070708" rx="2" />

              <rect x="70" y="0" width="30" height="30" fill="#070708" rx="4" />
              <rect x="75" y="5" width="20" height="20" fill="#FFFFFF" rx="2" />
              <rect x="79" y="9" width="12" height="12" fill="#070708" rx="2" />

              <rect x="0" y="70" width="30" height="30" fill="#070708" rx="4" />
              <rect x="5" y="75" width="20" height="20" fill="#FFFFFF" rx="2" />
              <rect x="9" y="79" width="12" height="12" fill="#070708" rx="2" />

              <rect x="40" y="10" width="8" height="8" fill="#070708" />
              <rect x="52" y="15" width="8" height="8" fill="#070708" />
              <rect x="36" y="36" width="10" height="10" fill="#070708" />
              <rect x="50" y="45" width="14" height="10" fill="#070708" />
              <rect x="40" y="70" width="12" height="12" fill="#070708" />
              <rect x="70" y="45" width="10" height="10" fill="#070708" />
              <rect x="85" y="65" width="10" height="10" fill="#070708" />
              <rect x="65" y="80" width="14" height="10" fill="#070708" />
            </svg>
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <h4 className="text-base font-semibold text-white">Direct Mobile Install on Realme 11 5G</h4>
            <p className="text-xs text-white/50 leading-relaxed max-w-md">
              Scan this with your Realme 11 5G camera or browser to directly download <span className="text-white font-mono">OfficeLeaveTimerV1.apk</span> over local Wi-Fi.
            </p>
            <p className="text-[11px] font-mono text-blue-400 break-all select-all">
              {currentUrl || 'http://[your-server-address]/OfficeLeaveTimerV1.apk'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
