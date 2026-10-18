import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

const ibmArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "تقييم الوضع الحالي | ERPNext الموارد البشرية",
  description:
    "بطاقات تفاعلية لتقييم As-Is لدورات الموارد البشرية قبل تطبيق ERPNext وفق منهجية نضج العمليات.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={`${ibmArabic.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <footer className="site-footer">
          <a href="/">التقييم</a>
          <span>·</span>
          <a href="/admin">لوحة الأدمن</a>
        </footer>
      </body>
    </html>
  );
}
