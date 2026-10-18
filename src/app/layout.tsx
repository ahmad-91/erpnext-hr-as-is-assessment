import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, Readex_Pro } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/lib/brand";

const ibmArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

const readex = Readex_Pro({
  variable: "--font-readex",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: `تقييم الوضع الحالي | ${BRAND.nameAr}`,
  description: `استبيان As-Is لدورات الموارد البشرية — ${BRAND.nameAr} (${BRAND.nameEn})`,
  appleWebApp: {
    capable: true,
    title: `${BRAND.shortAr} · تقييم As-Is`,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F27420",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${ibmArabic.variable} ${readex.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <footer className="site-footer">
          <span>{BRAND.nameAr}</span>
          <span>·</span>
          <a href="/">التقييم</a>
          <span>·</span>
          <a href="/admin">لوحة الأدمن</a>
          <span>·</span>
          <a href={BRAND.website} target="_blank" rel="noreferrer">
            {BRAND.website.replace("https://", "")}
          </a>
        </footer>
      </body>
    </html>
  );
}
