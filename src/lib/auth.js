import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabaseUrl = "https://ysujwpvxxuaiwqnqzxzg.supabase.co";
const supabaseKey =
  "sb_publishable_hCkjAPkWsyGrbWa9rHiMrQ_GPca_azF";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Função para hash de senha
export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

// Função para comparar senha
export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// Inicializar admin padrão
export async function initializeAdmin() {
  try {
    // Verificar se admin já existe
    const { data } = await supabase
      .from("usuarios_admin")
      .select("*")
      .eq("usuario", "marco")
      .single();

    if (!data) {
      // Criar admin padrão
      const senhaHash = await hashPassword("22510827");
      await supabase.from("usuarios_admin").insert({
        usuario: "marco",
        senha_hash: senhaHash,
      });
    }
  } catch (error) {
    console.error("Erro ao inicializar admin:", error);
  }
}
