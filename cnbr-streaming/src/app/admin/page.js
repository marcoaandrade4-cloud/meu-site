"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [items, setItems] = useState([]);
  const [users, setUsers] =
    useState([]);

  useEffect(() => {
    const savedMovies =
      JSON.parse(
        localStorage.getItem("movies")
      ) || [];

    setItems(savedMovies);

    let savedUsers =
      JSON.parse(
        localStorage.getItem("users")
      ) || [];

    if (savedUsers.length === 0) {
      savedUsers = [
        {
          username: "marco",
          password: "22510827",
        },
      ];

      localStorage.setItem(
        "users",
        JSON.stringify(savedUsers)
      );
    }

    setUsers(savedUsers);
  }, []);

  function persistMovies(data) {
    setItems(data);

    localStorage.setItem(
      "movies",
      JSON.stringify(data)
    );
  }

  function persistUsers(data) {
    setUsers(data);

    localStorage.setItem(
      "users",
      JSON.stringify(data)
    );
  }

  function saveAll() {
    localStorage.setItem(
      "movies",
      JSON.stringify(items)
    );

    localStorage.setItem(
      "users",
      JSON.stringify(users)
    );

    alert("Tudo salvo!");
  }

  function updateItem(id, field, value) {
    const updated = items.map((item) =>
      item.id === id
        ? {
            ...item,
            [field]: value,
          }
        : item
    );

    setItems(updated);
  }

  function deleteItem(id) {
    const updated = items.filter(
      (item) => item.id !== id
    );

    persistMovies(updated);
  }

  function addMovie() {
    const updated = [
      ...items,
      {
        id: Date.now().toString(),
        title: "Novo Filme",
        image: "",
        description: "",
        type: "movie",
        video: "",
      },
    ];

    persistMovies(updated);
  }

  function addSeries() {
    const updated = [
      ...items,
      {
        id: Date.now().toString(),
        title: "Nova Série",
        image: "",
        description: "",
        type: "series",
        seasons: [],
      },
    ];

    persistMovies(updated);
  }

  function addSeason(itemId) {
    const updated = items.map((item) => {
      if (item.id !== itemId)
        return item;

      return {
        ...item,
        seasons: [
          ...(item.seasons || []),
          {
            season:
              (item.seasons?.length || 0) +
              1,
            episodes: [],
          },
        ],
      };
    });

    persistMovies(updated);
  }

  function deleteSeason(
    itemId,
    seasonNumber
  ) {
    const updated = items.map((item) => {
      if (item.id !== itemId)
        return item;

      return {
        ...item,
        seasons: item.seasons.filter(
          (season) =>
            season.season !==
            seasonNumber
        ),
      };
    });

    persistMovies(updated);
  }

  function addEpisode(
    itemId,
    seasonNumber
  ) {
    const updated = items.map((item) => {
      if (item.id !== itemId)
        return item;

      return {
        ...item,
        seasons: item.seasons.map(
          (season) => {
            if (
              season.season !==
              seasonNumber
            )
              return season;

            return {
              ...season,
              episodes: [
                ...season.episodes,
                {
                  title:
                    "Novo Episódio",
                  description: "",
                  video: "",
                },
              ],
            };
          }
        ),
      };
    });

    persistMovies(updated);
  }

  function deleteEpisode(
    itemId,
    seasonNumber,
    episodeIndex
  ) {
    const updated = items.map((item) => {
      if (item.id !== itemId)
        return item;

      return {
        ...item,
        seasons: item.seasons.map(
          (season) => {
            if (
              season.season !==
              seasonNumber
            )
              return season;

            return {
              ...season,
              episodes:
                season.episodes.filter(
                  (_, index) =>
                    index !==
                    episodeIndex
                ),
            };
          }
        ),
      };
    });

    persistMovies(updated);
  }

  function updateEpisode(
    itemId,
    seasonNumber,
    episodeIndex,
    field,
    value
  ) {
    const updated = items.map((item) => {
      if (item.id !== itemId)
        return item;

      return {
        ...item,
        seasons: item.seasons.map(
          (season) => {
            if (
              season.season !==
              seasonNumber
            )
              return season;

            return {
              ...season,
              episodes:
                season.episodes.map(
                  (
                    episode,
                    index
                  ) => {
                    if (
                      index !==
                      episodeIndex
                    )
                      return episode;

                    return {
                      ...episode,
                      [field]:
                        value,
                    };
                  }
                ),
            };
          }
        ),
      };
    });

    setItems(updated);
  }

  function addUser() {
    const updated = [
      ...users,
      {
        username: "novo",
        password: "1234",
      },
    ];

    persistUsers(updated);
  }

  function updateUser(
    index,
    field,
    value
  ) {
    const updated = [...users];

    updated[index][field] = value;

    setUsers(updated);
  }

  function deleteUser(index) {
    const updated = users.filter(
      (_, i) => i !== index
    );

    persistUsers(updated);
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

      <h1 style={{ color: "red" }}>
        Painel ADM
      </h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={addMovie}
          style={{
            padding: "10px",
            background: "green",
            border: "none",
            color: "white",
            cursor: "pointer",
          }}
        >
          + Novo Filme
        </button>

        <button
          onClick={addSeries}
          style={{
            padding: "10px",
            background: "red",
            border: "none",
            color: "white",
            cursor: "pointer",
          }}
        >
          + Nova Série
        </button>

        <button
          onClick={addUser}
          style={{
            padding: "10px",
            background: "#444",
            border: "none",
            color: "white",
            cursor: "pointer",
          }}
        >
          + Usuário ADM
        </button>

        <button
          onClick={saveAll}
          style={{
            padding: "10px",
            background: "#666",
            border: "none",
            color: "white",
            cursor: "pointer",
          }}
        >
          Salvar Tudo
        </button>
      </div>

      <h2>Usuários ADM</h2>

      {users.map((user, index) => (
        <div
          key={index}
          style={{
            background: "#222",
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "10px",
          }}
        >
          <input
            value={user.username}
            placeholder="Usuário"
            onChange={(e) =>
              updateUser(
                index,
                "username",
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
            }}
          />

          <input
            value={user.password}
            placeholder="Senha"
            onChange={(e) =>
              updateUser(
                index,
                "password",
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
            }}
          />

          <button
            onClick={() =>
              deleteUser(index)
            }
            style={{
              padding: "10px",
              background: "darkred",
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
          >
            Excluir Usuário
          </button>
        </div>
      ))}

      <hr
        style={{
          margin: "40px 0",
          borderColor: "#333",
        }}
      />

      {items.map((item) => (
        <div
          key={item.id}
          style={{
            background: "#222",
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "10px",
          }}
        >
          <h2>{item.title}</h2>

          <button
            onClick={() =>
              deleteItem(item.id)
            }
            style={{
              padding: "10px",
              background: "darkred",
              border: "none",
              color: "white",
              cursor: "pointer",
              marginBottom: "20px",
            }}
          >
            Excluir
          </button>

          <br />

          <input
            value={item.title}
            placeholder="Título"
            onChange={(e) =>
              updateItem(
                item.id,
                "title",
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: "10px",
            }}
          />

          <br />
          <br />

          <input
            value={item.image}
            placeholder="Imagem"
            onChange={(e) =>
              updateItem(
                item.id,
                "image",
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: "10px",
            }}
          />

          <br />
          <br />

          <textarea
            value={item.description}
            placeholder="Descrição"
            onChange={(e) =>
              updateItem(
                item.id,
                "description",
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: "10px",
              minHeight: "100px",
            }}
          />

          <br />
          <br />

          {item.type === "movie" && (
            <input
              value={item.video || ""}
              placeholder="Link do Filme"
              onChange={(e) =>
                updateItem(
                  item.id,
                  "video",
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "10px",
              }}
            />
          )}

          {item.type === "series" && (
            <>
              <button
                onClick={() =>
                  addSeason(item.id)
                }
                style={{
                  padding: "10px",
                  background: "#555",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  marginBottom: "20px",
                }}
              >
                + Temporada
              </button>

              {item.seasons?.map(
                (season) => (
                  <div
                    key={season.season}
                    style={{
                      background: "#333",
                      padding: "20px",
                      marginBottom: "20px",
                      borderRadius: "10px",
                    }}
                  >
                    <h3>
                      Temporada{" "}
                      {season.season}
                    </h3>

                    <button
                      onClick={() =>
                        deleteSeason(
                          item.id,
                          season.season
                        )
                      }
                      style={{
                        padding: "10px",
                        background:
                          "darkred",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                        marginBottom:
                          "20px",
                      }}
                    >
                      Excluir Temporada
                    </button>

                    <br />

                    <button
                      onClick={() =>
                        addEpisode(
                          item.id,
                          season.season
                        )
                      }
                      style={{
                        padding: "10px",
                        background:
                          "#666",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                        marginBottom:
                          "20px",
                      }}
                    >
                      + Episódio
                    </button>

                    {season.episodes?.map(
                      (
                        episode,
                        episodeIndex
                      ) => (
                        <div
                          key={
                            episodeIndex
                          }
                          style={{
                            background:
                              "#444",
                            padding:
                              "20px",
                            borderRadius:
                              "10px",
                            marginBottom:
                              "20px",
                          }}
                        >
                          <h4>
                            Episódio{" "}
                            {episodeIndex +
                              1}
                          </h4>

                          <button
                            onClick={() =>
                              deleteEpisode(
                                item.id,
                                season.season,
                                episodeIndex
                              )
                            }
                            style={{
                              padding:
                                "10px",
                              background:
                                "darkred",
                              border:
                                "none",
                              color:
                                "white",
                              cursor:
                                "pointer",
                              marginBottom:
                                "20px",
                            }}
                          >
                            Excluir Episódio
                          </button>

                          <br />

                          <input
                            value={
                              episode.title
                            }
                            placeholder="Título episódio"
                            onChange={(
                              e
                            ) =>
                              updateEpisode(
                                item.id,
                                season.season,
                                episodeIndex,
                                "title",
                                e.target
                                  .value
                              )
                            }
                            style={{
                              width:
                                "100%",
                              padding:
                                "10px",
                            }}
                          />

                          <br />
                          <br />

                          <textarea
                            value={
                              episode.description
                            }
                            placeholder="Descrição episódio"
                            onChange={(
                              e
                            ) =>
                              updateEpisode(
                                item.id,
                                season.season,
                                episodeIndex,
                                "description",
                                e.target
                                  .value
                              )
                            }
                            style={{
                              width:
                                "100%",
                              padding:
                                "10px",
                              minHeight:
                                "80px",
                            }}
                          />

                          <br />
                          <br />

                          <input
                            value={
                              episode.video
                            }
                            placeholder="Link episódio"
                            onChange={(
                              e
                            ) =>
                              updateEpisode(
                                item.id,
                                season.season,
                                episodeIndex,
                                "video",
                                e.target
                                  .value
                              )
                            }
                            style={{
                              width:
                                "100%",
                              padding:
                                "10px",
                            }}
                          />
                        </div>
                      )
                    )}
                  </div>
                )
              )}
            </>
          )}
        </div>
      ))}
    </main>
  );
}