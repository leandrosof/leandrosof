import Image from "next/image";
import Link from "next/link";
import TypingEffect from "./TypingEffect";

export default function Header() {
  return (
    <header id="inicio">
      <div className="profile-img-wrapper">
        <Image
          src="/leandro_silva.jpg"
          alt="Leandro Silva"
          className="profile-img"
          width={180}
          height={180}
        />
      </div>

      <h1>Leandro Silva</h1>
      <TypingEffect />

      <div className="location">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        Planaltina, DF
      </div>

      <div className="hero-tagline">
        <span>30M+ visualizações</span>
        <span className="hero-sep">·</span>
        <span>8+ anos de XP</span>
        <span className="hero-sep">·</span>
        <span>10+ grandes plataformas</span>
      </div>

      <div className="social-buttons">
        <a
          href="https://www.instagram.com/leandrosof/"
          target="_blank"
          rel="noreferrer"
          className="btn btn-instagram"
        >
          Instagram
        </a>
        <a
          href="https://www.tiktok.com/@leandro_sof"
          target="_blank"
          rel="noreferrer"
          className="btn btn-tiktok"
        >
          TikTok
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
          Contato Comercial
        </a>
      </div>

      <div className="nav-links">
        <Link href="/#conteudo">O Criador</Link>
        <Link href="/#reels">Reels</Link>
        <Link href="/#dev">Portfólio Tech</Link>
        <Link href="/ferramentas">Ferramentas</Link>
        <Link href="/#sobre">Sobre Mim</Link>
      </div>
    </header>
  );
}
