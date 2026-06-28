export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://leandrosof.com.br/#person",
        name: "Leandro Silva",
        alternateName: "leandrosof",
        url: "https://leandrosof.com.br",
        image: "https://leandrosof.com.br/leandro_silva.jpg",
        jobTitle: "Analista de Sistemas | Criador de Conteúdo",
        description:
          "Criador de conteúdo, Analista de Sistemas e especialista em UX & IoT. Desenvolvedor de software com foco em projetos de impacto social e ambiental.",
        sameAs: [
          "https://www.instagram.com/leandrosof/",
          "https://www.tiktok.com/@leandro_sof",
          "https://www.twitch.tv/leandrosof",
        ],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Planaltina",
          addressRegion: "DF",
          addressCountry: "BR",
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://leandrosof.com.br/#website",
        url: "https://leandrosof.com.br",
        name: "Leandro Silva",
        description:
          "Portfólio oficial e 27 ferramentas gratuitas de Leandro Silva. Criador de conteúdo, desenvolvedor e especialista em UX & IoT.",
        inLanguage: "pt-BR",
        publisher: { "@id": "https://leandrosof.com.br/#person" },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://leandrosof.com.br/ferramentas?busca={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "FAQPage",
        "@id": "https://leandrosof.com.br/#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "Quais ferramentas gratuitas o site oferece?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Oferecemos 27 ferramentas gratuitas incluindo: calculadora IMC, gerador QR Code, compressor imagem, removedor fundo IA, calculadora férias CLT, conversor moedas, gerador hashtags, formatador JSON, gerador CPF/CNPJ, gerador senhas, calculadora juros compostos, entre outras.",
            },
          },
          {
            "@type": "Question",
            name: "Como calcular o valor das férias CLT?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Use nossa calculadora de férias gratuita. Informe o salário bruto, dias de férias (até 30) e se deseja vender 10 dias (abono pecuniário). O cálculo inclui 1/3 constitucional, descontos de INSS e IRRF conforme tabelas vigentes.",
            },
          },
          {
            "@type": "Question",
            name: "O removedor de fundo funciona sem internet?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sim! Nosso removedor de fundo usa IA que roda 100% no navegador via WebAssembly. Após baixar o modelo na primeira execução (~10MB), funciona offline. Suas imagens nunca são enviadas a servidores.",
            },
          },
          {
            "@type": "Question",
            name: "Como gerar QR Code para WhatsApp?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Acesse o Gerador de QR Code, selecione o template WhatsApp, digite o número com DDD e o QR Code é gerado automaticamente com o link wa.me. Você pode personalizar cores, tamanho e baixar em PNG ou SVG.",
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
