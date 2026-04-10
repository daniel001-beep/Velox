import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AIChatAssistant from "./components/AIChatAssistant";
import { Providers } from "./components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Redstore - Premium Shopping",
  description: "Discover premium fashion, tech, and living essentials powered by AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen flex grow flex-col">
            <Navbar />
            <main className="grow pt-20">{children}</main>
            <Footer />
            <AIChatAssistant />
          </div>
        </Providers>
      </body>
    </html>
  );
}