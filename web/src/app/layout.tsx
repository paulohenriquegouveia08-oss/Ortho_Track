import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OrthoTrack | Monitoramento de uso para alinhadores removíveis",
  description:
    "O OrthoTrack ajuda clínicas odontológicas a acompanhar a aderência de pacientes em tratamento com alinhadores removíveis, com registros de uso, relatórios e status em tempo real.",
  keywords: [
    "alinhadores removíveis",
    "monitoramento ortodôntico",
    "aderência ao tratamento",
    "Invisalign",
    "app para dentistas",
    "software para clínicas odontológicas",
    "acompanhamento de pacientes",
    "HealthTech odontológica",
  ],
  openGraph: {
    title: "OrthoTrack | Monitoramento de uso para alinhadores removíveis",
    description:
      "O OrthoTrack ajuda clínicas odontológicas a acompanhar a aderência de pacientes em tratamento com alinhadores removíveis.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
