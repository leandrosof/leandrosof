import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://leandrosof.com.br";

  const routes: MetadataRoute.Sitemap = [
    "",
    "/ferramentas/whatsapp",
    "/ferramentas/gerador-bio-instagram",
    "/ferramentas/engajamento",
    "/ferramentas/roi",
    "/ferramentas/calculadora-freelance",
    "/ferramentas/contador-caracteres",
    "/ferramentas/gerador-paleta-cores",
    "/ferramentas/tmb",
    "/ferramentas/1rm",
    "/ferramentas/box-shadow",
    "/ferramentas/quiz-ia",
    "/ferramentas/como-passar-whitelist-gta-rp",
    "/ferramentas/como-calcular-churrasco",
    "/ferramentas/calculadora-salario-liquido",
    "/ferramentas/gerenciador-de-racha",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  return routes;
}
