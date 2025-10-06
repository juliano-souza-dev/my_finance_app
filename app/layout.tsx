'use client'

import Navbar from "./components/Navbar";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
        {/* LIGAÇÃO ESSENCIAL DO PWA (Mantendo o que fizemos) */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Tags de otimização para iOS (Mantendo o que fizemos) */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MyFinance" />
      </head>
      <body>
        {/* Usamos a tag <main> para aplicar os estilos de layout do globals.css */}
        <main>
            <AuthProvider>
                <Navbar />
                {children}
            </AuthProvider>
        </main>
      </body>
    </html>
  );
}