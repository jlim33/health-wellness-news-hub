import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VitaPulse | Evidence-Based Health, Nutrition & Longevity Intelligence",
  description: "Peer-reviewed medical research, clinical longevity insights, and relaxing ambient audio lounge.",
  keywords: ["health news", "evidence based medicine", "the lancet", "nature medicine", "longevity", "microbiome", "vitapulse"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen antialiased selection:bg-sage-400 selection:text-slate-900">
        {/* ==================== UBIQUITARIAN BRAND BANNER ==================== */}
        <aside className="ubiquitarian-banner" style={{ background: 'linear-gradient(90deg, #090d16 0%, #111827 50%, #090d16 100%)', color: '#cbd5e1', fontSize: '12px', fontWeight: 600, textAlign: 'center', padding: '7px 14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', zIndex: 99999, position: 'relative', letterSpacing: '0.02em', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px' }}>🌐</span>
            <span>Powered by</span>
            <a href="https://www.ubiquitarian.info" target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
              Ubiquitarian.info
              <span style={{ fontSize: '10px', marginLeft: '2px' }}>↗</span>
            </a>
          </span>
        </aside>
        {children}
      </body>
    </html>
  );
}
