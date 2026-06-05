"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const STYLES = {
  main: { background: "#111", minHeight: "100vh", color: "#fff", padding: "20px", fontFamily: "Arial, sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", borderBottom: "2px solid red", paddingBottom: "20px" },
  headerTitle: { margin: 0, fontSize: "28px" },
  headerRight: { display: "flex", gap: "20px", alignItems: "center" },
  button: { background: "red", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer", fontSize: "14px" },
  buttonBlue: { background: "blue", color: "#fff", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer" },
  buttonDelete: { background: "#8b0000", color: "#fff", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer" },
  input: { width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", background: "#222", color: "#fff", border: "1px solid #333", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", background: "#222", color: "#fff", border: "1px solid #333", boxSizing: "border-box", minHeight: "80px" },
  container: { background: "#1a1a1a", padding: "20px", borderRadius: "10px", marginBottom: "30px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" },
  card: { background: "#1a1a1a", padding: "20px", borderRadius: "10px", border: "1px solid #333" },
  errorBox: { background: "#8b0000", padding: "15px", marginBottom: "20px", borderRadius: "5px", borderLeft: "4px solid #ff0000" },
  successBox: { background: "#006400", padding: "15px", marginBottom: "20px", borderRadius: "5px", borderLeft: "4px solid #00ff00" },
};

export default function AdminPage() {
  const [token, setToken] = useState(null);
  const [usuario, setUsuario] = useState("");
  const [aba, setAba] = useState("series");
  const [series, setSeries] = useState([]);
  const [temporadas, setTemporadas] = useState([]);
  const [episodios, setEpisodios] = useState([]);
  const [serieAtual, setSerieAtual] = useState(null);
  const [temporadaAtual, setTemporadaAtual] = useState(null);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [uploadando, setUploadando] = useState(false);
  const router = useRouter();

  const [novaSerieForm, setNovaSerieForm] = useState({ titulo: "", descricao: "", capa: "" });
  const [novaTemporadaForm, setNovaTemporadaForm] = useState({ numero: "" });
  const [novoEpisodioForm, setNovoEpisodioForm] = useState({ numero: "", titulo: "", video: "", tipo_video: "upload" });
  const [novoAdminForm, setNovoAdminForm] = useState({ usuario: "", senha: "" });
  const [novaSenha, setNovaSenha] = useState("");

  useEffect(() => {
    const authToken = localStorage.getItem("admin_token");
    const authUsuario = localStorage.getItem("admin_usuario");

    if (!authToken) {
      router.push("/login");
    } else {
      setToken(authToken);
      setUsuario(authUsuario);
      carregarSeries();
    }
  }, []);

  async function carregarSeries() {
    try {
      const res = await fetch("/api/series");
      const data = await res.json();
      setSeries(Array.isArray(data) ? data : []);
    } catch (err) {
      setErro("Erro ao carregar séries");
    }
  }

  async function carregarTemporadas(serieId) {
    try {
      const res = await fetch(`/api/temporadas?serieId=${serieId}`);
      const data = await res.json();
      setTemporadas(Array.isArray(data) ? data : []);
      setSerieAtual(serieId);
    } catch (err) {
      setErro("Erro ao carregar temporadas");
    }
  }

  async function carregarEpisodios(temporadaId) {
    try {
      const res = await fetch(`/api/episodios?temporadaId=${temporadaId}`);
      const data = await res.json();
      setEpisodios(Array.isArray(data) ? data : []);
      setTemporadaAtual(temporadaId);
    } catch (err) {
      setErro("Erro ao carregar episódios");
    }
  }

  async function adicionarSerie() {
    if (!novaSerieForm.titulo) {
      setErro("Título é obrigatório");
      return;
    }

    try {
      const res = await fetch("/api/series", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": token,
        },
        body: JSON.stringify(novaSerieForm),
      });

      if (!res.ok) throw new Error("Erro ao adicionar série");

      setNovaSerieForm({ titulo: "", descricao: "", capa: "" });
      setSucesso("✅ Série adicionada com sucesso!");
      carregarSeries();
      setTimeout(() => setErro(""), 3000);
    } catch (err) {
      setErro("❌ Erro ao adicionar série");
    }
  }

  async function adicionarTemporada() {
    if (!novaTemporadaForm.numero || !serieAtual) {
      setErro("Preencha todos os campos");
      return;
    }

    try {
      const res = await fetch("/api/temporadas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": token,
        },
        body: JSON.stringify({
          serie_id: serieAtual,
          numero: parseInt(novaTemporadaForm.numero),
        }),
      });

      if (!res.ok) throw new Error();

      setNovaTemporadaForm({ numero: "" });
      setSucesso("✅ Temporada adicionada!");
      carregarTemporadas(serieAtual);
    } catch (err) {
      setErro("❌ Erro ao adicionar temporada");
    }
  }

  async function adicionarEpisodio() {
    if (!novoEpisodioForm.numero || !novoEpisodioForm.titulo || !novoEpisodioForm.video || !temporadaAtual) {
      setErro("Preencha todos os campos");
      return;
    }

    try {
      const res = await fetch("/api/episodios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": token,
        },
        body: JSON.stringify({
          temporada_id: temporadaAtual,
          numero: parseInt(novoEpisodioForm.numero),
          titulo: novoEpisodioForm.titulo,
          video: novoEpisodioForm.video,
          tipo_video: novoEpisodioForm.tipo_video,
        }),
      });

      if (!res.ok) throw new Error();

      setNovoEpisodioForm({ numero: "", titulo: "", video: "", tipo_video: "upload" });
      setSucesso("✅ Episódio adicionado!");
      carregarEpisodios(temporadaAtual);
    } catch (err) {
      setErro("❌ Erro ao adicionar episódio");
    }
  }

  async function uploadArquivo(e, callback) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadando(true);
    setErro("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tipo", "video");

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "authorization": token },
        body: formData,
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      callback(data.url);
      setSucesso("✅ Arquivo enviado!");
    } catch (err) {
      setErro("❌ Erro ao fazer upload");
    } finally {
      setUploadando(false);
    }
  }

  async function deletarSerie(id) {
    if (!confirm("Tem certeza?")) return;

    try {
      await fetch("/api/series", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "authorization": token,
        },
        body: JSON.stringify({ id }),
      });
      setSucesso("✅ Série deletada!");
      carregarSeries();
    } catch (err) {
      setErro("❌ Erro ao deletar");
    }
  }

  async function deletarTemporada(id) {
    if (!confirm("Tem certeza?")) return;

    try {
      await fetch("/api/temporadas", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "authorization": token,
        },
        body: JSON.stringify({ id }),
      });
      carregarTemporadas(serieAtual);
    } catch (err) {
      setErro("❌ Erro ao deletar");
    }
  }

  async function deletarEpisodio(id) {
    if (!confirm("Tem certeza?")) return;

    try {
      await fetch("/api/episodios", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "authorization": token,
        },
        body: JSON.stringify({ id }),
      });
      carregarEpisodios(temporadaAtual);
    } catch (err) {
      setErro("❌ Erro ao deletar");
    }
  }

  function logout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_usuario");
    router.push("/login");
  }

  return (
    <main style={STYLES.main}>
      <div style={STYLES.header}>
        <h1 style={STYLES.headerTitle}>🎬 STREAMFLIXX ADMIN</h1>
        <div style={STYLES.headerRight}>
          <span>👤 {usuario}</span>
          <button onClick={logout} style={STYLES.button}>Logout</button>
        </div>
      </div>

      {erro && <div style={STYLES.errorBox}>{erro}</div>}
      {sucesso && <div style={STYLES.successBox}>{sucesso}</div>}

      <div style={{ display: "flex", gap: "10px", marginBottom: "30px", flexWrap: "wrap" }}>
        {["series", "temporadas", "episodios", "admins"].map((tab) => (
          <button
            key={tab}
            onClick={() => setAba(tab)}
            style={{
              ...STYLES.button,
              background: aba === tab ? "red" : "#333",
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {aba === "series" && (
        <div>
          <h2>📺 Séries</h2>
          <div style={STYLES.container}>
            <h3>Adicionar Nova Série</h3>
            <input type="text" placeholder="Título" value={novaSerieForm.titulo} onChange={(e) => setNovaSerieForm({ ...novaSerieForm, titulo: e.target.value })} style={STYLES.input} />
            <textarea placeholder="Descrição" value={novaSerieForm.descricao} onChange={(e) => setNovaSerieForm({ ...novaSerieForm, descricao: e.target.value })} style={STYLES.textarea} />
            <input type="text" placeholder="URL da capa" value={novaSerieForm.capa} onChange={(e) => setNovaSerieForm({ ...novaSerieForm, capa: e.target.value })} style={STYLES.input} />
            <button onClick={adicionarSerie} style={STYLES.button}>➕ Adicionar</button>
          </div>

          <div style={STYLES.grid}>
            {series.map((serie) => (
              <div key={serie.id} style={STYLES.card}>
                {serie.capa && <img src={serie.capa} alt={serie.titulo} style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "5px", marginBottom: "10px" }} />}
                <h4>{serie.titulo}</h4>
                <p style={{ fontSize: "12px", color: "#999" }}>{serie.descricao}</p>
                <button onClick={() => carregarTemporadas(serie.id)} style={{ ...STYLES.buttonBlue, width: "48%", marginRight: "2%" }}>📺 Temporadas</button>
                <button onClick={() => deletarSerie(serie.id)} style={{ ...STYLES.buttonDelete, width: "48%" }}>🗑️ Deletar</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {aba === "temporadas" && (
        <div>
          <h2>📅 Temporadas</h2>
          {!serieAtual ? (
            <p style={{ color: "#999" }}>Selecione uma série primeiro</p>
          ) : (
            <>\n              <div style={STYLES.container}>\n                <h3>Adicionar Temporada</h3>\n                <input type=\"number\" placeholder=\"Número\" value={novaTemporadaForm.numero} onChange={(e) => setNovaTemporadaForm({ numero: e.target.value })} style={STYLES.input} />\n                <button onClick={adicionarTemporada} style={STYLES.button}>➕ Adicionar</button>\n              </div>\n\n              <div style={{ display: \"grid\", gap: \"10px\" }}>\n                {temporadas.map((temp) => (\n                  <div key={temp.id} style={{ ...STYLES.card, display: \"flex\", justifyContent: \"space-between\", alignItems: \"center\" }}>\n                    <span>Temporada {temp.numero}</span>\n                    <div>\n                      <button onClick={() => carregarEpisodios(temp.id)} style={{ ...STYLES.buttonBlue, marginRight: \"10px\" }}>📹 Episódios</button>\n                      <button onClick={() => deletarTemporada(temp.id)} style={STYLES.buttonDelete}>🗑️</button>\n                    </div>\n                  </div>\n                ))}\n              </div>\n            </>\n          )}\n        </div>\n      )}\n\n      {aba === \"episodios\" && (\n        <div>\n          <h2>📹 Episódios</h2>\n          {!temporadaAtual ? (\n            <p style={{ color: \"#999\" }}>Selecione uma temporada primeiro</p>\n          ) : (\n            <>\n              <div style={STYLES.container}>\n                <h3>Adicionar Episódio</h3>\n                <input type=\"number\" placeholder=\"Número\" value={novoEpisodioForm.numero} onChange={(e) => setNovoEpisodioForm({ ...novoEpisodioForm, numero: e.target.value })} style={STYLES.input} />\n                <input type=\"text\" placeholder=\"Título\" value={novoEpisodioForm.titulo} onChange={(e) => setNovoEpisodioForm({ ...novoEpisodioForm, titulo: e.target.value })} style={STYLES.input} />\n                <select value={novoEpisodioForm.tipo_video} onChange={(e) => setNovoEpisodioForm({ ...novoEpisodioForm, tipo_video: e.target.value })} style={STYLES.input}>\n                  <option value=\"upload\">📤 Upload</option>\n                  <option value=\"youtube\">▶️ YouTube</option>\n                  <option value=\"drive\">☁️ Google Drive</option>\n                </select>\n\n                {novoEpisodioForm.tipo_video === \"upload\" && (\n                  <>\n                    <label style={{ fontSize: \"12px\" }}>Arquivo:</label>\n                    <input type=\"file\" accept=\"video/*\" onChange={(e) => uploadArquivo(e, (url) => setNovoEpisodioForm({ ...novoEpisodioForm, video: url }))} disabled={uploadando} style={STYLES.input} />\n                    {uploadando && <p style={{ color: \"#999\", fontSize: \"12px\" }}>⏳ Enviando...</p>}\n                    {novoEpisodioForm.video && <p style={{ color: \"#0f0\", fontSize: \"12px\" }}>✅ Carregado</p>}\n                  </>\n                )}\n\n                {novoEpisodioForm.tipo_video === \"youtube\" && (\n                  <input type=\"text\" placeholder=\"ID YouTube (ex: dQw4w9WgXcQ)\" value={novoEpisodioForm.video} onChange={(e) => setNovoEpisodioForm({ ...novoEpisodioForm, video: e.target.value })} style={STYLES.input} />\n                )}\n\n                {novoEpisodioForm.tipo_video === \"drive\" && (\n                  <input type=\"text\" placeholder=\"ID Google Drive\" value={novoEpisodioForm.video} onChange={(e) => setNovoEpisodioForm({ ...novoEpisodioForm, video: e.target.value })} style={STYLES.input} />\n                )}\n\n                <button onClick={adicionarEpisodio} style={STYLES.button}>➕ Adicionar</button>\n              </div>\n\n              <div style={{ display: \"grid\", gap: \"10px\" }}>\n                {episodios.map((ep) => (\n                  <div key={ep.id} style={{ ...STYLES.card, display: \"flex\", justifyContent: \"space-between\", alignItems: \"center\" }}>\n                    <div>\n                      <strong>Ep {ep.numero}: {ep.titulo}</strong>\n                      <p style={{ fontSize: \"12px\", color: \"#999\", margin: \"5px 0 0 0\" }}>{ep.tipo_video === \"youtube\" ? \"▶️ YouTube\" : ep.tipo_video === \"drive\" ? \"☁️ Drive\" : \"📤 Upload\"}</p>\n                    </div>\n                    <button onClick={() => deletarEpisodio(ep.id)} style={STYLES.buttonDelete}>🗑️</button>\n                  </div>\n                ))}\n              </div>\n            </>\n          )}\n        </div>\n      )}\n\n      {aba === \"admins\" && (\n        <div>\n          <h2>👥 Admins</h2>\n          <div style={STYLES.container}>\n            <h3>Adicionar Admin</h3>\n            <input type=\"text\" placeholder=\"Usuário\" value={novoAdminForm.usuario} onChange={(e) => setNovoAdminForm({ ...novoAdminForm, usuario: e.target.value })} style={STYLES.input} />\n            <input type=\"password\" placeholder=\"Senha\" value={novoAdminForm.senha} onChange={(e) => setNovoAdminForm({ ...novoAdminForm, senha: e.target.value })} style={STYLES.input} />\n            <button\n              onClick={async () => {\n                try {\n                  const res = await fetch(\"/api/admins\", {\n                    method: \"POST\",\n                    headers: { \"Content-Type\": \"application/json\", \"authorization\": token },\n                    body: JSON.stringify(novoAdminForm),\n                  });\n                  if (!res.ok) throw new Error();\n                  setNovoAdminForm({ usuario: \"\", senha: \"\" });\n                  setSucesso(\"✅ Admin adicionado!\");\n                } catch (err) {\n                  setErro(\"❌ Erro ao adicionar\");\n                }\n              }}\n              style={STYLES.button}\n            >\n              ➕ Adicionar\n            </button>\n          </div>\n\n          <div style={STYLES.container}>\n            <h3>Alterar Senha</h3>\n            <input type=\"password\" placeholder=\"Nova Senha\" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} style={STYLES.input} />\n            <button\n              onClick={async () => {\n                try {\n                  const res = await fetch(\"/api/admins\", {\n                    method: \"PUT\",\n                    headers: { \"Content-Type\": \"application/json\", \"authorization\": token },\n                    body: JSON.stringify({ id: token, novaSenha }),\n                  });\n                  if (!res.ok) throw new Error();\n                  setNovaSenha(\"\");\n                  setSucesso(\"✅ Senha alterada!\");\n                } catch (err) {\n                  setErro(\"❌ Erro ao alterar\");\n                }\n              }}\n              style={STYLES.button}\n            >\n              🔐 Alterar\n            </button>\n          </div>\n        </div>\n      )}\n    </main>\n  );\n}
