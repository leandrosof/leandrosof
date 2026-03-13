import Link from "next/link";

export default function FerramentasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header
        style={{
          minHeight: "auto",
          padding: "1.5rem 5%",
          backgroundColor: "var(--surface-color)",
          borderBottom: "2px solid var(--primary-color)",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2
          style={{ fontSize: "1.5rem", margin: 0, padding: 0, border: "none" }}
        >
          <span style={{ color: "var(--text-color)" }}>Leandro</span>
          <span style={{ color: "var(--primary-color)" }}>Silva</span>
        </h2>
        <Link
          href="/"
          className="btn btn-email"
          style={{ fontSize: "0.9rem", padding: "8px 15px" }}
        >
          ← Voltar ao Portfólio
        </Link>
      </header>

      {children}
    </>
  );
}
