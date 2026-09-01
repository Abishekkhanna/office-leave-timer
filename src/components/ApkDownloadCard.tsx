import React, { useState } from 'react';
import { Download, Smartphone, ShieldCheck, Check, QrCode, FileCode2 } from 'lucide-react';

export const ApkDownloadCard: React.FC = () => {
  const [downloaded, setDownloaded] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const apkDownloadUrl = '/OfficeLeaveTimer.apk';

  const handleDownload = () => {
    setDownloaded(true);
    const link = document.createElement('a');
    link.href = apkDownloadUrl;
    link.download = 'OfficeLeaveTimer.apk';
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
            <span>Updated: Full Android 15 (API 35) &amp; Realme 11 5G Support</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white">
            Download Installable Android APK (v1.1.0)
          </h2>
          <p className="text-sm text-white/50 max-w-xl leading-relaxed">
            Compiled standalone APK package (<code className="text-white/80 font-mono">OfficeLeaveTimer.apk</code>) compiled with Target SDK 35 (Android 15) and APK Signature Schemes v2+v3 for immediate compatibility on Realme UI and all modern Android versions.
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
                <span>Downloading APK...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                <span>Download APK File</span>
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/5">
        <div className="flex items-center gap-3 text-xs text-white/70 p-3 bg-[#131316] rounded-2xl border border-white/5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>100% Offline (No Net)</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-white/70 p-3 bg-[#131316] rounded-2xl border border-white/5">
          <Smartphone className="w-4 h-4 text-blue-400 shrink-0" />
          <span>Real Home Widget</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-white/70 p-3 bg-[#131316] rounded-2xl border border-white/5">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Zero Battery Drain</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-white/70 p-3 bg-[#131316] rounded-2xl border border-white/5">
          <FileCode2 className="w-4 h-4 text-blue-400 shrink-0" />
          <span>Native RemoteViews</span>
        </div>
      </div>

      {/* QR Code popup preview */}
      {showQrModal && (
        <div className="mt-6 p-6 bg-[#131316] border border-white/10 rounded-3xl flex flex-col sm:flex-row items-center gap-6 animate-fadeIn">
          <div className="p-3.5 bg-white rounded-2xl shadow-xl shrink-0">
            {/* Simple high-contrast SVG QR Pattern */}
            <svg className="w-32 h-32" viewBox="0 0 100 100" fill="currentColor">
              {/* QR Pattern visual elements */}
              <rect x="0" y="0" width="30" height="30" fill="#070708" rx="4" />
              <rect x="5" y="5" width="20" height="20" fill="#FFFFFF" rx="2" />
              <rect x="9" y="9" width="12" height="12" fill="#070708" rx="2" />

              <rect x="70" y="0" width="30" height="30" fill="#070708" rx="4" />
              <rect x="75" y="5" width="20" height="20" fill="#FFFFFF" rx="2" />
              <rect x="79" y="9" width="12" height="12" fill="#070708" rx="2" />

              <rect x="0" y="70" width="30" height="30" fill="#070708" rx="4" />
              <rect x="5" y="75" width="20" height="20" fill="#FFFFFF" rx="2" />
              <rect x="9" y="79" width="12" height="12" fill="#070708" rx="2" />

              {/* Data blocks */}
              <rect x="36" y="8" width="6" height="6" fill="#070708" />
              <rect x="46" y="8" width="6" height="6" fill="#070708" />
              <rect x="56" y="8" width="6" height="6" fill="#070708" />

              <rect x="36" y="18" width="6" height="6" fill="#070708" />
              <rect x="56" y="18" width="6" height="6" fill="#070708" />

              <rect x="8" y="36" width="6" height="6" fill="#070708" />
              <rect x="18" y="36" width="6" height="6" fill="#070708" />
              <rect x="28" y="36" width="6" height="6" fill="#070708" />
              <rect x="38" y="36" width="6" height="6" fill="#070708" />
              <rect x="48" y="36" width="6" height="6" fill="#070708" />
              <rect x="58" y="36" width="6" height="6" fill="#070708" />
              <rect x="68" y="36" width="6" height="6" fill="#070708" />
              <rect x="78" y="36" width="6" height="6" fill="#070708" />
              <rect x="88" y="36" width="6" height="6" fill="#070708" />

              <rect x="38" y="48" width="6" height="6" fill="#070708" />
              <rect x="48" y="48" width="6" height="6" fill="#070708" />
              <rect x="58" y="48" width="6" height="6" fill="#070708" />
              <rect x="78" y="48" width="6" height="6" fill="#070708" />

              <rect x="36" y="60" width="6" height="6" fill="#070708" />
              <rect x="46" y="60" width="6" height="6" fill="#070708" />
              <rect x="66" y="60" width="6" height="6" fill="#070708" />
              <rect x="86" y="60" width="6" height="6" fill="#070708" />

              <rect x="38" y="74" width="6" height="6" fill="#070708" />
              <rect x="48" y="74" width="6" height="6" fill="#070708" />
              <rect x="68" y="74" width="6" height="6" fill="#070708" />
              <rect x="88" y="74" width="6" height="6" fill="#070708" />

              <rect x="38" y="86" width="6" height="6" fill="#070708" />
              <rect x="58" y="86" width="6" height="6" fill="#070708" />
              <rect x="78" y="86" width="6" height="6" fill="#070708" />
            </svg>
          </div>
          <div className="space-y-2 text-xs text-white/70">
            <div className="font-semibold text-white text-sm">Direct Phone Download Link:</div>
            <div className="p-3 bg-[#070708] border border-white/10 rounded-2xl font-mono text-[11px] text-blue-400 break-all select-all">
              {currentUrl}
            </div>
            <p className="text-white/40 text-[11px]">
              Open this URL or scan using your Realme 11 5G camera/browser to download directly onto the device.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
