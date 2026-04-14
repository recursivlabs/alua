import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* Primary */}
        <title>Alua — Breathwork & Surf Retreats</title>
        <meta name="description" content="Boutique retreat experiences weaving breathwork and surfing into containers for healing, growth, and connection. Sri Lanka · Indonesia · Costa Rica." />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://alua.on.recursiv.io" />
        <meta property="og:title" content="Alua — Breathwork & Surf Retreats" />
        <meta property="og:description" content="Boutique retreat experiences weaving breathwork and surfing into containers for healing, growth, and connection. Sri Lanka · Indonesia · Costa Rica." />
        <meta property="og:site_name" content="Alua" />
        {/* Swap this when branding delivers a real OG image */}
        {/* <meta property="og:image" content="https://alua.on.recursiv.io/og-image.png" /> */}
        {/* <meta property="og:image:width" content="1200" /> */}
        {/* <meta property="og:image:height" content="630" /> */}

        {/* Twitter / iMessage */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Alua — Breathwork & Surf Retreats" />
        <meta name="twitter:description" content="Boutique retreat experiences weaving breathwork and surfing into containers for healing, growth, and connection." />

        {/* Theme */}
        <meta name="theme-color" content="#FAF7F4" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Prevent RN scroll issues */}
        <ScrollViewStyleReset />

        <style dangerouslySetInnerHTML={{ __html: `
          html, body { background-color: #FAF7F4; }
          #root { display: flex; flex: 1; min-height: 100vh; }
        `}} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
