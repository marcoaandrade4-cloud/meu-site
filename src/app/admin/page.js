"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [token, setToken] = useState(null);
  const [usuario, setUsuario] = useState("");
  const [aba, setAba] = useState("series");
  const [series, setSeries] = useState([]);
  const [temporadas, setTemporadas] = useState([]);
  const [episodios, setEpisodios] = useState([]);
  const [serieAtual, setSerieAtual] = useState(null);
  const [temporadaAtual, setTemporadaAtual] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const router = useRouter();

  // Form states
  const [novaSerieForm, setNovaSerieForm] = useState({ titulo: "", descricao: "" });
  const [novaTemporadaForm, setNovaTemporadaForm] = useState({ numero: "", serieId: "" });
  const [novoEpisodioForm, setNovoEpisodioForm] = useState({ numero: "", titulo: "", video: "", temporadaId: "" });
  const [novoAdminForm, setNovoAdminForm] = useState({ usuario: "", senha: "" });
  const [novaSenha, setNovaSenha] = useState("");

  const router2 = useRouter();

  // Verificar autenticação
  useEffect(() => {
    const authToken = localStorage.getItem("admin_token");
    const authUsuario = localStorage.getItem("admin_usuario");

    if (!authToken) {
      router.push("/login");
    } else {
      setToken(authToken);
      setUsuario(authUsuario);
      carregarDados();
    }
  }, []);

  async function carregarDados() {
    try {
      const { data: seriesData } = await supabase
        .from("series")
        .select("*");
      setSeries(seriesData || []);
      setLoading(false);
    } catch (err) {
      setErro("Erro ao carregar dados");
      setLoading(false);
    }
  }

  async function adicionarSerie() {
    if (!novaSerieForm.titulo) {
      setErro("Título é obrigatório");
      return;
    }

    try {
      const { error } = await supabase
        .from("series")
        .insert([novaSerieForm]);

      if (error) throw error;

      setNovaSerieForm({ titulo: "", descricao: "" });
      carregarDados();
      setErro("");
    } catch (err) {
      setErro("Erro ao adicionar série");
    }
  }

  async function adicionarTemporada() {
    if (!novaTemporadaForm.numero || !novaTemporadaForm.serieId) {
      setErro("Preencha todos os campos");
      return;
    }

    try {
      const { error } = await supabase
        .from("temporadas")
        .insert([novaTemporadaForm]);

      if (error) throw error;

      setNovaTemporadaForm({ numero: "", serieId: "" });
      carregarTemporadas(novaTemporadaForm.serieId);
      setErro("");
    } catch (err) {
      setErro("Erro ao adicionar temporada");
    }
  }

  async function adicionarEpisodio() {
    if (!novoEpisodioForm.numero || !novoEpisodioForm.titulo || !novoEpisodioForm.video || !novoEpisodioForm.temporadaId) {
      setErro("Preencha todos os campos");
      return;
    }

    try {
      const { error } = await supabase
        .from("episodios")
        .insert([novoEpisodioForm]);

      if (error) throw error;

      setNovoEpisodioForm({ numero: "", titulo: "", video: "", temporadaId: "" });
      carregarEpisodios(novoEpisodioForm.temporadaId);
      setErro("");
    } catch (err) {
      setErro("Erro ao adicionar episódio");
    }
  }

  async function deletarSerie(id) {
    if (!confirm("Tem certeza?")) return;

    try {
      await supabase.from("series").delete().eq("id", id);
      carregarDados();
    } catch (err) {
      setErro("Erro ao deletar série");
    }
  }

  async function deletarTemporada(id) {
    if (!confirm("Tem certeza?")) return;

    try {
      await supabase.from("temporadas").delete().eq("id", id);
      carregarTemporadas(serieAtual);
    } catch (err) {
      setErro("Erro ao deletar temporada");
    }
  }

  async function deletarEpisodio(id) {
    if (!confirm("Tem certeza?")) return;

    try {
      await supabase.from("episodios").delete().eq("id", id);
      carregarEpisodios(temporadaAtual);
    } catch (err) {
      setErro("Erro ao deletar episódio");
    }
  }

  async function adicionarAdmin() {
    if (!novoAdminForm.usuario || !novoAdminForm.senha) {
      setErro("Preencha todos os campos");
      return;
    }

    try {
      const response = await fetch("/api/admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": token,
        },
        body: JSON.stringify(novoAdminForm),
      });

      if (!response.ok) throw new Error("Erro ao adicionar admin");

      setNovoAdminForm({ usuario: "", senha: "" });
      setErro("");
    } catch (err) {
      setErro("Erro ao adicionar admin");
    }
  }

  async function alterarSenha() {
    if (!novaSenha) {
      setErro("Digite a nova senha");
      return;
    }

    try {
      const response = await fetch("/api/admins", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "authorization": token,
        },
        body: JSON.stringify({ id: token, novaSenha }),
      });

      if (!response.ok) throw new Error("Erro ao alterar senha");

      setNovaSenha("");
      setErro("");
    } catch (err) {
      setErro("Erro ao alterar senha");
    }
  }

  async function carregarTemporadas(serieId) {
    try {
      const { data } = await supabase
        .from("temporadas")
        .select("*")
        .eq("serie_id", serieId);
      setTemporadas(data || []);
    } catch (err) {
      setErro("Erro ao carregar temporadas");
    }
  }

  async function carregarEpisodios(temporadaId) {
    try {
      const { data } = await supabase
        .from("episodios")
        .select("*")
        .eq("temporada_id", temporadaId);
      setEpisodios(data || []);
    } catch (err) {
      setErro("Erro ao carregar episódios");
    }
  }

  function logout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_usuario");
    router2.push("/login");
  }

  if (loading) {
    return <div style={{ color: "#fff", padding: "20px" }}>Carregando...</div>;
  }

  return (
    <main style={{ background: "#111", minHeight: "100vh", color: "#fff", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>PAINEL ADMIN</h1>
        <div>
          <span style={{ marginRight: "20px" }}>Logado como: <strong>{usuario}</strong></span>
          <button
            onClick={logout}
            style={{
              background: "red",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {erro && (
        <div style={{ background: "#8b0000", padding: "10px", marginBottom: "20px", borderRadius: "5px" }}>
          {erro}
        </div>
      )}

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={() => setAba("series")}
          style={{
            background: aba === "series" ? "red" : "#333",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Séries
        </button>
        <button
          onClick={() => setAba("admins")}
          style={{
            background: aba === "admins" ? "red" : "#333",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Admins
        </button>
      </div>

      {aba === "series" && (
        <div>
          <h2>Gerenciar Séries</h2>
          <div style={{ background: "#1a1a1a", padding: "20px", borderRadius: "10px", marginBottom: "20px" }}>
            <h3>Adicionar Série</h3>
            <input
              type="text"
              placeholder="Título"
              value={novaSerieForm.titulo}
              onChange={(e) => setNovaSerieForm({ ...novaSerieForm, titulo: e.target.value })}
              style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}
            />
            <textarea
              placeholder="Descrição"
              value={novaSerieForm.descricao}
              onChange={(e) => setNovaSerieForm({ ...novaSerieForm, descricao: e.target.value })}
              style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", minHeight: "100px" }}
            />
            <button
              onClick={adicionarSerie}
              style={{ background: "red", color: "#fff", border: "none", padding: "10px 20px", cursor: "pointer", borderRadius: "5px" }}
            >
              Adicionar Série
            </button>
          </div>

          <div>
            {series.map((serie) => (
              <div key={serie.id} style={{ background: "#1a1a1a", padding: "20px", marginBottom: "10px", borderRadius: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3>{serie.titulo}</h3>
                  <button
                    onClick={() => deletarSerie(serie.id)}
                    style={{ background: "#8b0000", color: "#fff", border: "none", padding: "5px 10px", cursor: "pointer" }}
                  >
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {aba === "admins" && (
        <div>
          <h2>Gerenciar Admins</h2>
          <div style={{ background: "#1a1a1a", padding: "20px", borderRadius: "10px", marginBottom: "20px" }}>
            <h3>Adicionar Novo Admin</h3>
            <input
              type="text"
              placeholder="Usuário"
              value={novoAdminForm.usuario}
              onChange={(e) => setNovoAdminForm({ ...novoAdminForm, usuario: e.target.value })}
              style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}
            />
            <input
              type="password"
              placeholder="Senha"
              value={novoAdminForm.senha}
              onChange={(e) => setNovoAdminForm({ ...novoAdminForm, senha: e.target.value })}
              style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}
            />
            <button
              onClick={adicionarAdmin}
              style={{ background: "red", color: "#fff", border: "none", padding: "10px 20px", cursor: "pointer", borderRadius: "5px" }}
            >
              Adicionar Admin
            </button>
          </div>

          <div style={{ background: "#1a1a1a", padding: "20px", borderRadius: "10px" }}>
            <h3>Alterar Sua Senha</h3>
            <input
              type="password"
              placeholder="Nova Senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}
            />
            <button
              onClick={alterarSenha}
              style={{ background: "red", color: "#fff", border: "none", padding: "10px 20px", cursor: "pointer", borderRadius: "5px" }}
            >
              Alterar Senha
            </button>
          </div>
        </div>
      )}
    </main>
  );
}