import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WeatherAI Nigeria - Advanced Geospatial Weather Platform",
  description:
    "Real-time weather data for Nigeria with AI-powered insights, animal detection, and interactive 3D mapping powered by Cesium and Groq AI.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Prevent extension interference */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cesium.com https://cdn.jsdelivr.net; object-src 'none';"
        />
        <meta name="referrer" content="strict-origin-when-cross-origin" />

        {/* Preload Cesium resources */}
        <link
          rel="preload"
          href="https://cesium.com/downloads/cesiumjs/releases/1.111/Build/Cesium/Cesium.js"
          as="script"
        />
        <link
          rel="preload"
          href="https://cesium.com/downloads/cesiumjs/releases/1.111/Build/Cesium/Widgets/widgets.css"
          as="style"
        />
      </head>
      <body className={inter.className}>
        {/* Extension conflict protection */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Protect against extension interference
              (function() {
                // Suppress extension-related console errors
                const originalError = console.error;
                console.error = function(...args) {
                  const message = args.join(' ');
                  if (message.includes('chrome-extension://') || 
                      message.includes('web_accessible_resources') ||
                      message.includes('Port connected') ||
                      message.includes('Port disconnected')) {
                    return; // Suppress extension errors
                  }
                  originalError.apply(console, args);
                };

                // Protect global objects from extension modification
                if (typeof window !== 'undefined') {
                  Object.defineProperty(window, 'Cesium', {
                    writable: true,
                    configurable: false
                  });
                }
              })();
            `,
          }}
        />
        {children}
      </body>
    </html>
  )
}
