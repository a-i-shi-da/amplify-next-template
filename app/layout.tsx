import type { Metadata } from "next";
import MuiProvider from './_components/mui'
import { Inter } from "next/font/google";
import "./globals.css";
import "@aws-amplify/ui-react/styles.css";

import AmplifyProvider from '@/app/_components/provider'
import { MyAppBar } from "./_components/appbar";



const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "クイズ作成アプリ",
  description: "クイズを作成可能です。",
};

export default function RootLayout({
  children,modal
}: {
  children: React.ReactNode;
  modal:React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MuiProvider>
          <AmplifyProvider>
            <MyAppBar></MyAppBar>
            {children}
            {modal}
          </AmplifyProvider>
        </MuiProvider>
      </body>
    </html>
  );
}
