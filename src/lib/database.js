import { supabase } from "./supabase";
import bcrypt from "bcryptjs";

export async function initializeDatabase() {
  try {
    const { data: adminExists } = await supabase
      .from("usuarios_admin")
      .select("*")
      .eq("usuario", "marco")
      .single()
      .catch(() => ({ data: null }));

    if (!adminExists) {
      const senhaHash = await bcrypt.hash("22510827", 10);
      await supabase.from("usuarios_admin").insert({
        usuario: "marco",
        senha_hash: senhaHash,
      }).catch(() => null);
    }
  } catch (error) {
    console.error("Erro ao inicializar:", error);
  }
}
