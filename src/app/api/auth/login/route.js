import { supabase } from "@/lib/supabase";
import { comparePassword } from "@/lib/auth";

export async function POST(req) {
  try {
    const { usuario, senha } = await req.json();

    if (!usuario || !senha) {
      return Response.json(
        { erro: "Usuário e senha são obrigatórios" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("usuarios_admin")
      .select("*")
      .eq("usuario", usuario)
      .single();

    if (error || !data) {
      return Response.json(
        { erro: "Usuário ou senha incorretos" },
        { status: 401 }
      );
    }

    const senhaValida = await comparePassword(senha, data.senha_hash);

    if (!senhaValida) {
      return Response.json(
        { erro: "Usuário ou senha incorretos" },
        { status: 401 }
      );
    }

    return Response.json({
      token: data.id,
      usuario: data.usuario,
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return Response.json(
      { erro: "Erro ao fazer login" },
      { status: 500 }
    );
  }
}
