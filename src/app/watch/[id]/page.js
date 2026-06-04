import { supabase } from "@/lib/supabase";

export default async function WatchPage({ params }) {
  const { id } = await params;

  const { data: filme } = await supabase
    .from("filmes")
    .select("*")
    .eq("id", id)
    .single();

  if (!filme) {
    return <h1>Filme não encontrado</h1>;
  }

  return (
    <main
      style={{
        background: "#000",
        minHeight: "100vh",
        color: "#fff",
        padding: "20px",
      }}
    >
      <h1>{filme.titulo}</h1>

      <video
        controls
        width="100%"
        style={{
          maxWidth: "1000px",
        }}
      >
        <source
          src={filme.video}
          type="video/mp4"
        />
      </video>
    </main>
  );
}