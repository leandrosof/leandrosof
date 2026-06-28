import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://leandrosof.com.br";

  const routes: MetadataRoute.Sitemap = [
    "",
    "/ferramentas",
    "/ferramentas/whatsapp",
    "/ferramentas/gerador-bio-instagram",
    "/ferramentas/gerador-hashtags",
    "/ferramentas/engajamento",
    "/ferramentas/roi",
    "/ferramentas/calculadora-freelance",
    "/ferramentas/calculadora-ferias",
    "/ferramentas/contador-caracteres",
    "/ferramentas/gerador-paleta-cores",
    "/ferramentas/gerador-qrcode",
    "/ferramentas/gerador-senhas",
    "/ferramentas/gerador-cpf-cnpj",
    "/ferramentas/formatador-json",
    "/ferramentas/calculadora-imc",
    "/ferramentas/calculadora-juros-compostos",
    "/ferramentas/conversor-moedas",
    "/ferramentas/removedor-fundo",
    "/ferramentas/compressor-imagem",
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
