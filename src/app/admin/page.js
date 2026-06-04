"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [titulo, setTitulo] = useState("");
  const [video, setVideo] = useState("");
  const [capa, setCapa] = useState("");
  const [tipo, setTipo] = useState("filme");
  const [loading, setLoading] = useState(false);

  async function adicionarFilme() {
    // Validação
    if (!titulo.trim() || !video.trim() || !capa.trim()) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("filmes")
        .insert([
          {
            titulo,
            video,
            capa,
            tipo,
          },
        ]);

      if (error) {
        console.error("Erro ao adicionar:", error);
        alert(`Erro ao adicionar: ${error.message}`);
        setLoading(false);
        return;
      }

      alert("Adicionado com sucesso!");

      setTitulo("");
      setVideo("");
      setCapa("");
      setTipo("filme");
      setLoading(false);
    } catch (err) {
      console.error("Erro inesperado:", err);
      alert("Erro inesperado ao adicionar filme");
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#111",
        color: "#fff",
        padding: "20px",
      }}
    >
      <h1>PAINEL ADMIN</h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "500px",
        }}
      >
        <input
          placeholder="Título"
          value={titulo}
          onChange={(e) =>
            setTitulo(e.target.value)
          }
          disabled={loading}
          style={{
            padding: "12px",
            borderRadius: "8px",
            opacity: loading ? 0.6 : 1,
          }}
        />

        <input
          placeholder="Link do vídeo"
          value={video}
          onChange={(e) =>
            setVideo(e.target.value)
          }
          disabled={loading}
          style={{
            padding: "12px",
            borderRadius: "8px",
            opacity: loading ? 0.6 : 1,
          }}
        />

        <input
          placeholder="Link da capa"
          value={capa}
          onChange={(e) =>
            setCapa(e.target.value)
          }
          disabled={loading}
          style={{
            padding: "12px",
            borderRadius: "8px",
            opacity: loading ? 0.6 : 1,
          }}
        />

        <select
          value={tipo}
          onChange={(e) =>
            setTipo(e.target.value)
          }
          disabled={loading}
          style={{
            padding: "12px",
            borderRadius: "8px",
            opacity: loading ? 0.6 : 1,
          }}
        >
          <option value="filme">
            Filme
          </option>

          <option value="serie">
            Série
          </option>
        </select>

        <button
          onClick={adicionarFilme}
          disabled={loading}
          style={{
            padding: "12px",
            background: loading ? "#888" : "red",
            border: "none",
            color: "#fff",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Adicionando..." : "Adicionar"}
        </button>
      </div>
    </main>
  );
}
