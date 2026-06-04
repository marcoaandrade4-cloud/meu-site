import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function Home() {
  const { data: filmes } = await supabase
    .from("filmes")
    .select("*");

  return (
    <main
      style={{
        background: "#111",
        minHeight: "100vh",
        color: "#fff",
        padding: "20px",
      }}
    >
      <h1>STREAMFLIXX</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {filmes?.map((filme) => (
          <Link
            key={filme.id}
            href={`/watch/${filme.id}`}
            style={{
              textDecoration: "none",
              color: "#fff",
            }}
          >
            <div>
              <img
                src={filme.capa}
                alt={filme.titulo}
                style={{
                  width: "100%",
                  borderRadius: "10px",
                }}
              />

              <h2>{filme.titulo}</h2>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}