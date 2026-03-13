import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "Leandro Silva | Criador de Conteúdo & Tech",
  description:
    "Portfólio oficial de Leandro Silva. Criador de conteúdo, Analista de Sistemas e desenvolvedor.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
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

        {/* O Header saiu daqui! */}

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
