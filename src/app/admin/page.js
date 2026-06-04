"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [titulo, setTitulo] = useState("");
  const [video, setVideo] = useState("");
  const [capa, setCapa] = useState("");
  const [tipo, setTipo] = useState("filme");

  async function adicionarFilme() {
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
      alert("Erro ao adicionar");
      console.log(error);
      return;
    }

    alert("Filme adicionado!");

    setTitulo("");
    setVideo("");
    setCapa("");
    setTipo("filme");
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
      <h1>ADMIN</h1>

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
          style={{
            padding: "12px",
            borderRadius: "8px",
          }}
        />

        <input
          placeholder="Link do vídeo"
          value={video}
          onChange={(e) =>
            setVideo(e.target.value)
          }
          style={{
            padding: "12px",
            borderRadius: "8px",
          }}
        />

        <input
          placeholder="Link da capa"
          value={capa}
          onChange={(e) =>
            setCapa(e.target.value)
          }
          style={{
            padding: "12px",
            borderRadius: "8px",
          }}
        />

        <select
          value={tipo}
          onChange={(e) =>
            setTipo(e.target.value)
          }
          style={{
            padding: "12px",
            borderRadius: "8px",
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
          style={{
            padding: "12px",
            background: "red",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Adicionar
        </button>
      </div>
    </main>
  );
}