export const metadata = {
  title: "Stream Flix",
  description: "Streaming",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="pt">
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#111",
        }}
      >
        {children}
      </body>
    </html>
  );
}