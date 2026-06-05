import { supabase } from "@/lib/supabase";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const temporadaId = searchParams.get("temporadaId");

  try {
    let query = supabase.from("episodios").select("*");
    if (temporadaId) query = query.eq("temporada_id", temporadaId);
    const { data } = await query.order("numero");
    return Response.json(data || []);
  } catch (error) {
    return Response.json({ erro: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = req.headers.get("authorization");
    if (!token) {
      return Response.json({ erro: "Não autenticado" }, { status: 401 });
    }

    const { temporada_id, numero, titulo, video, tipo_video } = await req.json();

    const { data, error } = await supabase
      .from("episodios")
      .insert([{ temporada_id, numero, titulo, video, tipo_video }])
      .select();

    if (error) throw error;
    return Response.json(data[0]);
  } catch (error) {
    return Response.json({ erro: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const token = req.headers.get("authorization");
    if (!token) {
      return Response.json({ erro: "Não autenticado" }, { status: 401 });
    }

    const { id, numero, titulo, video, tipo_video } = await req.json();

    const { error } = await supabase
      .from("episodios")
      .update({ numero, titulo, video, tipo_video })
      .eq("id", id);

    if (error) throw error;
    return Response.json({ sucesso: true });
  } catch (error) {
    return Response.json({ erro: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const token = req.headers.get("authorization");
    if (!token) {
      return Response.json({ erro: "Não autenticado" }, { status: 401 });
    }

    const { id } = await req.json();

    const { error } = await supabase.from("episodios").delete().eq("id", id);

    if (error) throw error;
    return Response.json({ sucesso: true });
  } catch (error) {
    return Response.json({ erro: error.message }, { status: 500 });
  }
}
