import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header id="inicio">
      <Image
        src="/leandro_silva.jpg"
        alt="Leandro Silva"
        className="profile-img"
        width={180}
        height={180}
      />

      <h1>Leandro Silva</h1>
      <p>
        Criador de Conteúdo | Analista de Sistemas | Especialista em UX & IoT
      </p>
      <div className="location">📍 Planaltina, DF</div>

      <div className="social-buttons">
        <a
          href="https://www.tiktok.com/@leandro_sof"
          target="_blank"
          rel="noreferrer"
          className="btn btn-tiktok"
        >
          TikTok
        </a>
        <a
          href="https://www.instagram.com/leandrosof/"
          target="_blank"
          rel="noreferrer"
          className="btn btn-instagram"
        >
          Instagram
        </a>
        <a
          href="https://www.twitch.tv/leandrosof"
          target="_blank"
          rel="noreferrer"
          className="btn btn-twitch"
        >
          Twitch
        </a>
        <a
          href="mailto:leandrosof.comercial@gmail.com"
          className="btn btn-email"
        >
          ✉ Contato Comercial
        </a>
      </div>

      <div className="nav-links">
        <Link href="/#conteudo">O Criador</Link>
        <Link href="/#dev">Portfólio Tech</Link>
        <Link href="/ferramentas">Ferramentas</Link>
        <Link href="/#sobre">Sobre Mim</Link>
      </div>
    </header>
  );
}
