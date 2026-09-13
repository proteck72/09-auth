import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Providers from "@/components/Providers/Providers";
import AuthProvider from "@/components/AuthProvider/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "NoteHub",
  description: "NoteHub Application",
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AuthProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            {modal}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
