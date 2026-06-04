"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  function login() {
    let users =
      JSON.parse(
        localStorage.getItem("users")
      ) || [];

    if (users.length === 0) {
      users = [
        {
          username: "marco",
          password: "22510827",
        },
      ];

      localStorage.setItem(
        "users",
        JSON.stringify(users)
      );
    }

    const found = users.find(
      (u) =>
        u.username === username &&
        u.password === password
    );

    if (!found) {
      alert("Login inválido");
      return;
    }

    localStorage.setItem(
      "loggedAdmin",
      "true"
    );

    router.push("/admin");
  }

  return (
    <main
      style={{
        background: "#111",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "#222",
          padding: "40px",
          borderRadius: "10px",
          width: "400px",
        }}
      >
        <h1 style={{ color: "red" }}>
          Login ADM
        </h1>

        <input
          placeholder="Usuário"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
          }}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
          }}
        />

        <button
          onClick={login}
          style={{
            width: "100%",
            padding: "10px",
            background: "red",
            border: "none",
            color: "white",
            cursor: "pointer",
          }}
        >
          Entrar
        </button>
      </div>
    </main>
  );
}