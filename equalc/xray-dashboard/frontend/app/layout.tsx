import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Xray Dashboard",
  description: "Workflow Execution Monitor",
};


// ... imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        <div className="min-h-screen w-full bg-background">
            <main className="mx-[10%] py-20">
                {children}
            </main>
        </div>
      </body>
    </html>
  );
}
