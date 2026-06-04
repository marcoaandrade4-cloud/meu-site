const filmes = [
  {
    id: "1",
    titulo: "Avatar",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "2",
    titulo: "Batman",
    video: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: "3",
    titulo: "Superman",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
];

export async function generateStaticParams() {
  return filmes.map((filme) => ({
    id: filme.id,
  }));
}

export default async function WatchPage({ params }) {
  const filme = filmes.find((f) => f.id === params.id);

  if (!filme) {
    return <h1>Filme não encontrado</h1>;
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        padding: "20px",
      }}
    >
      <h1>{filme.titulo}</h1>

      <video
        controls
        width="100%"
        style={{ maxWidth: "1000px" }}
      >
        <source src={filme.video} type="video/mp4" />
      </video>
    </main>
  );
}