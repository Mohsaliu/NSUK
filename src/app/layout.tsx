import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import { Navbar } from "../components/Navbar";

export const metadata: Metadata = {
  title: "Droply - Campus Food & Parcel Delivery",
  description: "Food and parcel delivery for school environments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <div className="app-container">
            <Navbar />
            {children}
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
