import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://leandrosof.com.br";

  // 1. Tipamos a constante explicitamente com : MetadataRoute.Sitemap
  const routes: MetadataRoute.Sitemap = [
    "", // Página inicial
    "/ferramentas/whatsapp",
    "/ferramentas/engajamento",
    "/ferramentas/roi",
    "/ferramentas/tmb",
    "/ferramentas/1rm",
    "/ferramentas/box-shadow",
    "/ferramentas/quiz-ia",
    "/ferramentas/nomes-rp",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  return routes;
}
