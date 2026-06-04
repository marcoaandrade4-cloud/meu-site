"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function WatchPage() {
  const params = useParams();

  const [item, setItem] = useState(null);

  useEffect(() => {
    const movies =
      JSON.parse(
        localStorage.getItem("movies")
      ) || [];

    const found = movies.find(
      (m) => m.id === params.id
    );

    setItem(found);
  }, [params.id]);

  if (!item) {
    return (
      <main
        style={{
          background: "#111",
          color: "white",
          minHeight: "100vh",
          padding: "20px",
        }}
      >
        Conteúdo não encontrado
      </main>
    );
  }

  function renderVideo(url) {
    if (!url) return null;

    // YOUTUBE
    if (
      url.includes("youtube.com") ||
      url.includes("youtu.be")
    ) {
      let videoId = "";

      if (url.includes("watch?v=")) {
        videoId =
          url.split("watch?v=")[1];
      } else if (
        url.includes("youtu.be/")
      ) {
        videoId =
          url.split("youtu.be/")[1];
      }

      return (
        <iframe
          width="100%"
          height="500"
          src={`https://www.youtube.com/embed/${videoId}`}
          allowFullScreen
          style={{
            border: "none",
            borderRadius: "10px",
          }}
        />
      );
    }

    // GOOGLE DRIVE
    if (url.includes("drive.google.com")) {
      let fileId = "";

      if (url.includes("/d/")) {
        fileId =
          url.split("/d/")[1]
            .split("/")[0];
      }

      return (
        <iframe
          width="100%"
          height="500"
          src={`https://drive.google.com/file/d/${fileId}/preview`}
          allow="autoplay"
          style={{
            border: "none",
            borderRadius: "10px",
          }}
        />
      );
    }

    // MP4 NORMAL
    return (
      <video
        controls
        width="100%"
        style={{
          borderRadius: "10px",
        }}
      >
        <source
          src={url}
          type="video/mp4"
        />
      </video>
    );
  }

  return (
    <main
      style={{
        background: "#111",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <a
        href="/"
        style={{
          color: "white",
          textDecoration: "none",
        }}
      >
        ← Voltar
      </a>

      <br />
      <br />

      <h1>{item.title}</h1>

      {item.image && (
        <img
          src={item.image}
          alt={item.title}
          style={{
            width: "300px",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        />
      )}

      <p>{item.description}</p>

      <br />

      {item.type === "movie" && (
        <div>
          {renderVideo(item.video)}
        </div>
      )}

      {item.type === "series" && (
        <div>
          {item.seasons?.map((season) => (
            <div
              key={season.season}
              style={{
                marginBottom: "40px",
              }}
            >
              <h2>
                Temporada {season.season}
              </h2>

              {season.episodes?.map(
                (episode, index) => (
                  <div
                    key={index}
                    style={{
                      background: "#222",
                      padding: "20px",
                      marginBottom: "20px",
                      borderRadius: "10px",
                    }}
                  >
                    <h3>
                      {episode.title}
                    </h3>

                    <p>
                      {
                        episode.description
                      }
                    </p>

                    {renderVideo(
                      episode.video
                    )}
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}