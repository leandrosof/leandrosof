export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Falha na API externa");
    const data = await res.json();
    return Response.json({
      rates: data.rates,
      updated: new Date().toISOString(),
      source: "ExchangeRate-API (atualizado a cada hora)",
    });
  } catch {
    return Response.json(
      { error: "Cotações indisponíveis no momento." },
      { status: 502 }
    );
  }
}
