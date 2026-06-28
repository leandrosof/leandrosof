import "./globals.css";
import Script from "next/script";
import ParticleBackground from "@/components/ParticleBackground";
import JsonLd from "@/components/JsonLd";

export const metadata = {
  metadataBase: new URL("https://leandrosof.com.br"),
  title: {
    default: "Leandro Silva | Criador de Conteúdo, Tech & Ferramentas Gratuitas",
    template: "%s | Leandro Silva",
  },
  description:
    "Portfólio oficial de Leandro Silva (@leandrosof). Criador de conteúdo, Analista de Sistemas, Desenvolvedor e especialista em UX & IoT. Ferramentas gratuitas para Instagram, freelancers e criadores de conteúdo.",
  keywords: [
    "Leandro Silva",
    "leandrosof",
    "criador de conteúdo",
    "analista de sistemas",
    "UX",
    "IoT",
    "desenvolvedor",
    "ferramentas gratuitas",
    "calculadora engajamento",
    "gerador de bio instagram",
    "calculadora freelance",
    "portfolio dev",
    "GTA RP",
    "Planaltina DF",
  ],
  authors: [{ name: "Leandro Silva", url: "https://leandrosof.com.br" }],
  creator: "Leandro Silva",
  publisher: "Leandro Silva",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://leandrosof.com.br",
    siteName: "Leandro Silva",
    title: "Leandro Silva | Criador de Conteúdo, Tech & Ferramentas Gratuitas",
    description:
      "Portfólio oficial de Leandro Silva. Criador de conteúdo, desenvolvedor e especialista em UX & IoT. Ferramentas gratuitas para criadores.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Leandro Silva - Criador de Conteúdo & Tech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Leandro Silva | Criador de Conteúdo & Tech",
    description:
      "Portfólio oficial de Leandro Silva. Ferramentas gratuitas, conteúdo tech e lifestyle.",
    images: ["/og-image.png"],
    creator: "@leandrosof",
  },
  alternates: {
    canonical: "https://leandrosof.com.br",
    types: {
      "application/rss+xml": "https://leandrosof.com.br/sitemap.xml",
    },
  },
  verification: {
    google: "google37622cbb23fec224",
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="theme-color" content="#0a0a0f" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Leandro Silva" />
      </head>
      <body>
        <JsonLd />
        <ParticleBackground />

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YGVYMEH4Q9"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YGVYMEH4Q9');
          `}
        </Script>

        <Script id="pwa-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.register('/sw.js');
            }
          `}
        </Script>

        <main>{children}</main>

        <footer>
          <p>
            &copy; {new Date().getFullYear()} Leandro Silva. Criando impacto
            através de código e conteúdo.
          </p>
        </footer>
      </body>
    </html>
  );
}
