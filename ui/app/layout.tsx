import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Temporal Warehouse",
  description: "The inventory management system minimal application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased no-scrollbar`}
      >
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: 'text-white shadow-lg rounded-lg px-4 py-3',
            duration: 4000,
            style: {
              maxWidth: '380px',
            },
            success: {
              className: 'bg-green-800 h-24',
            },
            error: {
              className: 'bg-red-800',
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
