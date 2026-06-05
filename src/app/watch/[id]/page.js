"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function WatchPage({ params }) {
  const [filme, setFilme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(null);

  useEffect(() => {
    async function carregarFilme() {
      try {
        const { id: filmeId } = await params;
        setId(filmeId);

        const { data, error } = await supabase
          .from("filmes")
          .select("*")
          .eq("id", filmeId)
          .single();

        if (error) {
          console.error("Erro ao carregar filme:", error);
          setFilme(null);
        } else {
          setFilme(data);
        }
      } catch (err) {
        console.error("Erro inesperado:", err);
        setFilme(null);
      } finally {
        setLoading(false);
      }
    }

    carregarFilme();
  }, [params]);

  if (loading) {
    return <h1 style={{ color: "#fff", textAlign: "center", paddingTop: "50px" }}>Carregando...</h1>;
  }

  if (!filme) {
    return (
      <h1 style={{ color: "#fff", textAlign: "center", paddingTop: "50px" }}>
        Filme não encontrado
      </h1>
    );
  }

  return (
    <main
      style={{
        background: "#000",
        minHeight: "100vh",
        color: "#fff",
        padding: "20px",
      }}
    >
      <h1>{filme.titulo}</h1>

      <video
        controls
        width="100%"
        style={{
          maxWidth: "1000px",
        }}
      >
        <source src={filme.video} type="video/mp4" />
      </video>

      <div style={{ marginTop: "20px" }}>
        <p>
          <strong>Tipo:</strong> {filme.tipo === "filme" ? "🎬 Filme" : "📺 Série"}
        </p>
      </div>
    </main>
  );
}
