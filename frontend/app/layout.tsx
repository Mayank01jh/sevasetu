import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import DonationModal from "@/components/DonationModal";
import ReceiptModal from "@/components/ReceiptModal";
import CertificateModal from "@/components/CertificateModal";

export const metadata: Metadata = {
  title: "SevaSetu - Verified Impact, Statutory 80G Tax Vault & Volunteer Operations",
  description: "India's premier statutory-first philanthropy network connecting donors, field volunteers, and verified NGOs with 100% transparency.",
  icons: {
    icon: "/assets/sevasetu-logo.png",
    shortcut: "/assets/sevasetu-logo.png",
    apple: "/assets/sevasetu-logo.png",
  },
  openGraph: {
    title: "SevaSetu - Verified Impact Platform",
    description: "Statutory 80G Tax Vault, Ephemeral Volunteer Check-In & NGO Governance.",
    images: ["/assets/sevasetu-logo.png"],
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/assets/sevasetu-logo.png" />
        <link rel="shortcut icon" type="image/png" href="/assets/sevasetu-logo.png" />
        <link rel="apple-touch-icon" href="/assets/sevasetu-logo.png" />
      </head>
      <body>
        <AppProvider>
          <Navbar />
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <Footer />
          <AuthModal />
          <DonationModal />
          <ReceiptModal />
          <CertificateModal />
        </AppProvider>
      </body>
    </html>
  );
}
