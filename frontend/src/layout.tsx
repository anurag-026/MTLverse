/* eslint-disable @next/next/no-sync-scripts */
// RootLayout.tsx (server component)
import React, { Suspense } from "react";
import TanstackProvider from "@/app/providers/TanstackProvider";
import { MangaProvider } from "@/app/providers/MangaContext";
import LoadingSpinner from "./Components/LoadingSpinner";
import "./globals.css";
import TopNavbar from "./Components/TopNavbar";
import { ThemeProviderClient } from "./providers/ThemeProviderClient";
import { PreferencesProvider } from "./providers/PreferencesContext";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* <script
          src="https://unpkg.com/react-scan/dist/auto.global.js"
        /> */}
        </head>
      <body cz-shortcut-listen="true">
        <Suspense fallback={<LoadingSpinner text="Please Wait..." />}>
          <TanstackProvider>
            <MangaProvider>
              <ThemeProviderClient>
                <PreferencesProvider>
                <TopNavbar />
                {children}
                </PreferencesProvider>
              </ThemeProviderClient>
            </MangaProvider>
          </TanstackProvider>
        </Suspense>
      </body>
    </html>
  );
}