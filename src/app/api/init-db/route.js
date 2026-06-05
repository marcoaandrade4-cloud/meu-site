import { supabase } from "@/lib/supabase";

export async function POST(req) {
  try {
    // 1. Criar tabela usuarios_admin
    await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS usuarios_admin (
          id BIGSERIAL PRIMARY KEY,
          usuario VARCHAR(50) UNIQUE NOT NULL,
          senha_hash VARCHAR(255) NOT NULL,
          criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `,
    }).catch(() => null);

    // 2. Criar tabela series
    await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS series (
          id BIGSERIAL PRIMARY KEY,
          titulo VARCHAR(255) NOT NULL,
          descricao TEXT,
          criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `,
    }).catch(() => null);

    // 3. Criar tabela temporadas
    await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS temporadas (
          id BIGSERIAL PRIMARY KEY,
          serie_id BIGINT REFERENCES series(id) ON DELETE CASCADE,
          numero INTEGER NOT NULL,
          criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `,
    }).catch(() => null);

    // 4. Criar tabela episodios
    await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS episodios (
          id BIGSERIAL PRIMARY KEY,
          temporada_id BIGINT REFERENCES temporadas(id) ON DELETE CASCADE,
          numero INTEGER NOT NULL,
          titulo VARCHAR(255) NOT NULL,
          video VARCHAR(500) NOT NULL,
          criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `,
    }).catch(() => null);

    // Criar admin padrão
    const { hashPassword } = await import("@/lib/auth");
    const senhaHash = await hashPassword("22510827");

    await supabase
      .from("usuarios_admin")
      .insert({
        usuario: "marco",
        senha_hash: senhaHash,
      })
      .catch(() => null);

    return Response.json({ sucesso: true, mensagem: "Banco de dados inicializado!" });
  } catch (error) {
    console.error("Erro ao inicializar:", error);
    return Response.json(
      { erro: "Erro ao inicializar banco de dados", detalhes: error.message },
      { status: 500 }
    );
  }
}
