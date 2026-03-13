import Card from "@/components/Card";
import Script from "next/script";
import AnimationObserver from "@/components/AnimationObserver";
import Header from "@/components/Header";

// Variáveis com os embeds gigantes do seu Instagram para manter o código limpo
const reel1 = `<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/reel/DU8wrqqkZCq/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"></blockquote>`;
const reel2 = `<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/reel/DUmNrNbEaEM/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"></blockquote>`;
const reel3 = `<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/reel/DNCYeyttAnG/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"></blockquote>`;

export default function Home() {
  return (
    <>
      <Header />
      {/* Componente que faz as animações de scroll funcionarem */}
      <AnimationObserver />

      <section id="conteudo" className="creator-section">
        <h2>O Criador de Conteúdo</h2>
        <p
          style={{
            marginBottom: "2rem",
            fontSize: "1.1rem",
            color: "var(--text-secondary)",
          }}
        >
          Meu estilo de criação é dinâmico e autêntico. Acredito em mostrar a
          realidade de forma leve, mesclando o lado focado e analítico da
          tecnologia com o entretenimento puro e a disciplina do dia a dia. Seja
          em uma live, em um vídeo curto ou em um post, o objetivo é sempre
          conectar.
        </p>

        <div className="grid-container">
          <Card
            type="creator"
            title="🎮 Gaming & Lives"
            description="Na Twitch e nas redes, trago a vivência de um veterano de <strong>GTA RP</strong> (com mais de 4 anos desbravando cidades como Metropole, Complexo e Nordeste), além de partidas de FIFA e interação em tempo real com a comunidade."
          />
          <Card
            type="creator"
            title="💻 Tech Descomplicada"
            description="Transformo minha experiência de mercado em conteúdo. Falo sobre desenvolvimento (Front-end, Mobile), UX e carreira na programação, sempre buscando inspirar quem quer entrar ou evoluir na área."
          />
          <Card
            type="creator"
            title="💪 Lifestyle Real"
            description="A vida offline também vira conteúdo. Compartilho minha disciplina na musculação — o equilíbrio necessário para quem passa horas codando e streamando — e momentos de resenha, quase sempre acompanhado do meu cachorro, Frederico."
          />
        </div>
      </section>

      <section id="reels" className="creator-section">
        <h2>Últimos Reels</h2>
        <p
          style={{
            marginBottom: "2rem",
            fontSize: "1.1rem",
            color: "var(--text-secondary)",
          }}
        >
          Confira alguns dos meus conteúdos mais recentes direto do Instagram.
        </p>

        <div className="grid-container" style={{ justifyItems: "center" }}>
          <div
            className="reel-box"
            dangerouslySetInnerHTML={{ __html: reel1 }}
          ></div>
          <div
            className="reel-box"
            dangerouslySetInnerHTML={{ __html: reel2 }}
          ></div>
          <div
            className="reel-box"
            dangerouslySetInnerHTML={{ __html: reel3 }}
          ></div>
        </div>

        {/* Script nativo do Next para renderizar o Instagram */}
        <Script src="//www.instagram.com/embed.js" strategy="lazyOnload" />
      </section>

      <section id="dev">
        <h2>Portfólio Tech & Projetos Ambientais</h2>
        <p
          style={{
            marginBottom: "2rem",
            fontSize: "1.1rem",
            color: "var(--text-secondary)",
          }}
        >
          Como Analista de Sistemas pós-graduado em UX & IoT, atuo fortemente em
          projetos que geram impacto social e ambiental, além do desenvolvimento
          de interfaces responsivas.
        </p>

        <div className="grid-container">
          <Card
            type="tech"
            title="Sustentabilidade & Dados Científicos"
            description="Atuação em projetos de alto impacto socioambiental:<br /><br /><strong>• SOMAI:</strong> Plataforma online com dados científicos essenciais sobre as Terras Indígenas da Amazônia.<br /><strong>• CCAL:</strong> Calculadora de carbono online que acompanha estoque e emissões em diferentes territórios.<br /><strong>• ACI:</strong> Alerta Clima Indígena.<br /><strong>• SOMUC:</strong> Sistema de Observação e Monitoramento de Unidades de Conservação.<br /><strong>• ATER Paidégua & CNUC.</strong>"
          />
          <Card
            type="tech"
            title="Guardiã DF"
            description="Aplicativo mobile desenvolvido com foco na segurança das mulheres. O projeto uniu tecnologia e impacto social, conquistando o <strong>2º lugar em um Hackathon em 2025</strong>."
          />
          <Card
            type="tech"
            title="Hackathon & Especialização"
            description="<strong>Stack:</strong> JavaScript, React, Redux, Expo, UX Design e IoT.<br /><br />Vencedor do <strong>1º lugar no Hackathon Zé Gotinha</strong> na Campus Party de 2019 com a equipe Metadata."
          />
        </div>
      </section>

      <section id="sobre">
        <h2>Sobre Leandro Silva</h2>
        <p style={{ fontSize: "1.1rem", maxWidth: "800px", lineHeight: "1.8" }}>
          Nascido em 1992 e residente em Planaltina, DF, atuo como analista de
          sistemas, desenvolvedor de software, influenciador digital e criador
          de conteúdo (@leandrosof). Sou graduado em Sistemas para Internet pelo
          IFB e possuo pós-graduação em UX e IoT.
        </p>
        <p
          style={{
            fontSize: "1.1rem",
            maxWidth: "800px",
            lineHeight: "1.8",
            marginTop: "1rem",
          }}
        >
          Minha carreira inclui forte atuação na área de tecnologia da
          informação, com foco em desenvolvimento web e mobile, tendo orgulho de
          ser um dos desenvolvedores do aplicativo SOMUC. Sou bicampeão de pódio
          na Campus Party, conquistando o 1º lugar no hackathon &quot;Zé
          Gotinha&quot; em 2019 e o 2º lugar com o projeto &quot;Guardiã
          DF&quot; em 2025. Como criador de conteúdo, compartilho meu dia a dia
          unindo humor, lifestyle, rotina de treinos e os bastidores da
          tecnologia.
        </p>
      </section>
    </>
  );
}
