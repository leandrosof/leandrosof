import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gerador de QR Code Personalizado | Leandro Silva",
  description: "Gere QR Codes personalizados grátis: escolha cores, tamanho, margem e resistência a erros. Templates para WhatsApp, Wi-Fi, link e email. Download PNG e SVG.",
  keywords: ["gerar qr code","qr code personalizado","criar qr code colorido","qr code whatsapp","qr code wifi","qrcode gratis","qr code download","gerador qrcode"],
  openGraph: { title: "Gerador de QR Code Personalizado | Leandro Silva", description: "QR Codes personalizados com cores, templates e download PNG/SVG.", url: "https://leandrosof.com.br/ferramentas/gerador-qrcode", type: "website" },
  twitter: { card: "summary_large_image", title: "Gerador de QR Code Personalizado | Leandro Silva", description: "QR Codes personalizados com cores, templates e download PNG/SVG." },
  alternates: { canonical: "https://leandrosof.com.br/ferramentas/gerador-qrcode" },
};

export default function QRCodeLayout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
