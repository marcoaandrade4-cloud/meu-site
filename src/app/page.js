"use client";

import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [filmes, setFilmes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarFilmes() {
      try {
        const { data, error } = await supabase
          .from("filmes")
          .select("*")
          .order("id", { ascending: false });

        if (error) {
          console.error("Erro ao carregar filmes:", error);
          setFilmes([]);
        } else {
          setFilmes(data || []);
        }
      } catch (err) {
        console.error("Erro inesperado:", err);
        setFilmes([]);
      } finally {
        setLoading(false);
      }
    }

    carregarFilmes();
  }, []);

  return (
    <main
      style={{
        background: "#111",
        minHeight: "100vh",
        color: "#fff",
        padding: "20px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>STREAMFLIXX</h1>
        <Link href="/admin" style={{ color: "#fff", textDecoration: "none", fontSize: "14px", background: "#333", padding: "10px 20px", borderRadius: "5px" }}>
          Painel Admin
        </Link>
      </div>

      {loading ? (
        <p>Carregando filmes...</p>
      ) : filmes.length === 0 ? (
        <p>Nenhum filme disponível</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {filmes.map((filme) => (
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
                    objectFit: "cover",
                    height: "300px",
                  }}
                />

                <h2 style={{ marginTop: "10px" }}>{filme.titulo}</h2>
                <p style={{ fontSize: "12px", color: "#999" }}>
                  {filme.tipo === "filme" ? "🎬 Filme" : "📺 Série"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
