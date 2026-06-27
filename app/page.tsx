import Card from "@/components/Card";
import AnimationObserver from "@/components/AnimationObserver";
import Header from "@/components/Header";
import ReelsCarousel from "@/components/ReelsCarousel";
import { reels, getReelIframe } from "@/data/reels";

const reelEmbeds = reels.map((r) => getReelIframe(r.id));

export default function Home() {
  return (
    <>
      <Header />
      <AnimationObserver />

      <section id="conteudo" className="creator-section">
        <h2>O Criador de Conteúdo</h2>
        <p
          style={{
            marginBottom: "2rem",
            fontSize: "1.05rem",
            color: "var(--text-secondary)",
            maxWidth: "800px",
          }}
        >
          Meu estilo de criação é dinâmico e autêntico. Acredito em mostrar a
          realidade de forma leve, mesclando o lado focado e analítico da
          tecnologia com o entretenimento puro e a disciplina do dia a dia.
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
            fontSize: "1.05rem",
            color: "var(--text-secondary)",
            maxWidth: "800px",
          }}
        >
          Confira meus conteúdos mais recentes direto do Instagram. Arraste para
          navegar entre os vídeos.
        </p>

        <ReelsCarousel embeds={reelEmbeds} />
      </section>

      <section id="dev">
        <h2>Portfólio Tech & Projetos Ambientais</h2>
        <p
          style={{
            marginBottom: "2rem",
            fontSize: "1.05rem",
            color: "var(--text-secondary)",
            maxWidth: "800px",
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
        <p style={{ fontSize: "1.05rem", maxWidth: "800px", lineHeight: "1.8" }}>
          Nascido em 1992 e residente em Planaltina, DF, atuo como analista de
          sistemas, desenvolvedor de software, influenciador digital e criador
          de conteúdo (@leandrosof). Sou graduado em Sistemas para Internet pelo
          IFB e possuo pós-graduação em UX e IoT.
        </p>
        <p
          style={{
            fontSize: "1.05rem",
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
