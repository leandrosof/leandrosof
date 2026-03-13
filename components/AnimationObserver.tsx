"use client";

import { useEffect } from "react";

export default function AnimationObserver() {
  useEffect(() => {
    const observerOptions = { threshold: 0.1 };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.opacity = "1";
          (entry.target as HTMLElement).style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    // Seleciona todos os cards e aplica o estado inicial invisível
    document.querySelectorAll(".card").forEach((card) => {
      (card as HTMLElement).style.opacity = "0";
      (card as HTMLElement).style.transform = "translateY(20px)";
      (card as HTMLElement).style.transition = "all 0.6s ease-out";
      observer.observe(card);
    });

    // Limpeza do observer quando o componente desmontar
    return () => observer.disconnect();
  }, []);

  return null; // Este componente não renderiza nada visual, só executa a lógica
}
