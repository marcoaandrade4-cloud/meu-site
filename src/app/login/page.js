"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      router.push("/admin");
    }
  }, []);

  async function fazerLogin() {
    setLoading(true);
    setErro("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.erro || "Erro ao fazer login");
        setLoading(false);
        return;
      }

      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_usuario", data.usuario);

      router.push("/admin");
    } catch (err) {
      setErro("Erro ao conectar com servidor");
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        background: "#111",
        minHeight: "100vh",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "#1a1a1a",
          padding: "40px",
          borderRadius: "10px",
          maxWidth: "400px",
          width: "100%",
          border: "1px solid #333",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
          STREAMFLIXX - Admin
        </h1>

        {erro && (
          <div
            style={{
              background: "#8b0000",
              color: "#fff",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            {erro}
          </div>
        )}

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Usuário:
          </label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #333",
              background: "#222",
              color: "#fff",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "30px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Senha:
          </label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            disabled={loading}
            onKeyPress={(e) => e.key === "Enter" && fazerLogin()}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #333",
              background: "#222",
              color: "#fff",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          onClick={fazerLogin}
          disabled={loading || !usuario || !senha}
          style={{
            width: "100%",
            padding: "12px",
            background: loading ? "#555" : "red",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "16px",
          }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </div>
    </main>
  );
}