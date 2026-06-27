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
          "Portfólio oficial e ferramentas gratuitas de Leandro Silva. Criador de conteúdo, desenvolvedor e especialista em UX & IoT.",
        inLanguage: "pt-BR",
        publisher: { "@id": "https://leandrosof.com.br/#person" },
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
