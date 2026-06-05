import { supabase } from "@/lib/supabase";

export async function POST(req) {
  try {
    const token = req.headers.get("authorization");
    if (!token) {
      return Response.json({ erro: "Não autenticado" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const tipo = formData.get("tipo");

    if (!file) {
      return Response.json({ erro: "Arquivo não fornecido" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${tipo}/${fileName}`;

    const { error } = await supabase.storage
      .from("videos")
      .upload(filePath, buffer, {
        contentType: file.type,
      });

    if (error) {
      return Response.json({ erro: error.message }, { status: 400 });
    }

    const { data } = supabase.storage.from("videos").getPublicUrl(filePath);

    return Response.json({
      sucesso: true,
      url: data.publicUrl,
    });
  } catch (error) {
    return Response.json({ erro: error.message }, { status: 500 });
  }
}
