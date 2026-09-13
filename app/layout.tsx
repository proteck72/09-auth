import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Providers from "@/components/Providers/Providers";
import AuthProvider from "@/components/AuthProvider/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "NoteHub",
  description: "Note management application",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal?: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AuthProvider>
            <Header />
            <main>{children}</main>
            {modal}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}