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
   
      <html suppressHydrationWarning>
        <body>
            <AuthProvider>
            <Navbar />
          {children}
          </AuthProvider>
        </body>
      </html>
   
  );
}
