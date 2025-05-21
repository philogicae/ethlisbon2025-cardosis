import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
// import { SidebarProvider } from "@/components/ui/sidebar";
import { Web3Provider } from "@/providers/Web3Provider";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Cardosis",
  description: "Roundup your GnosisPay transactions investing on AAVE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`flex antialiased`}>
        <Web3Provider>
          {/* <SidebarProvider> */}
          <div className="flex mx-auto">
            <div className="w-[80px]">
              <Navigation className="sticky top-[80px] mr-0" />
            </div>
            <main className="w-full max-w-[1200px]">{children}</main>
          </div>
          {/* </SidebarProvider> */}
        </Web3Provider>
      </body>
    </html>
  );
}
