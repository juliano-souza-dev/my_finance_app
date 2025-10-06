'use client'

import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "./components/Navbar";




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
