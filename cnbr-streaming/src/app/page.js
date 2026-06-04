"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] =
    useState("");

  useEffect(() => {
    let saved =
      JSON.parse(
        localStorage.getItem("movies")
      ) || [];

    setItems(saved);
  }, []);

  const filtered = items.filter(
    (item) =>
      item.title
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <main
      style={{
        background: "#111",
        minHeight: "100vh",
        color: "white",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ color: "red" }}>
          Stream Flix
        </h1>

        <a
          href="/login"
          style={{
            color: "white",
            textDecoration: "none",
          }}
        >
          ADM
        </a>
      </div>

      <br />

      <input
        type="text"
        placeholder="Pesquisar..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        style={{
          width: "100%",
          padding: "15px",
          borderRadius: "10px",
          border: "none",
          marginBottom: "30px",
        }}
      />

      <h2>Filmes</h2>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        {filtered
          .filter(
            (item) =>
              item.type === "movie"
          )
          .map((movie) => (
            <a
              key={movie.id}
              href={`/watch/${movie.id}`}
              style={{
                width: "200px",
                color: "white",
                textDecoration: "none",
              }}
            >
              {movie.image && (
                <img
                  src={movie.image}
                  alt={movie.title}
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                  }}
                />
              )}

              <p>{movie.title}</p>
            </a>
          ))}
      </div>

      <br />
      <br />

      <h2>Séries</h2>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        {filtered
          .filter(
            (item) =>
              item.type === "series"
          )
          .map((serie) => (
            <a
              key={serie.id}
              href={`/watch/${serie.id}`}
              style={{
                width: "200px",
                color: "white",
                textDecoration: "none",
              }}
            >
              {serie.image && (
                <img
                  src={serie.image}
                  alt={serie.title}
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                  }}
                />
              )}

              <p>{serie.title}</p>
            </a>
          ))}
      </div>
    </main>
  );
}