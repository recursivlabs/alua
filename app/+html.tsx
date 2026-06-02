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
        <title>Alua · Men's Breathwork & Surf Retreats</title>
        <meta name="description" content="Breathwork and surf retreats for men. Slow down, get in the water, and meet yourself with an open heart. Sri Lanka · Indonesia · Costa Rica." />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://alua.on.recursiv.io" />
        <meta property="og:title" content="Alua · Men's Breathwork & Surf Retreats" />
        <meta property="og:description" content="Breathwork and surf retreats for men. Slow down, get in the water, and meet yourself with an open heart. Sri Lanka · Indonesia · Costa Rica." />
        <meta property="og:site_name" content="Alua" />
        {/* Swap this when branding delivers a real OG image */}
        {/* <meta property="og:image" content="https://alua.on.recursiv.io/og-image.png" /> */}
        {/* <meta property="og:image:width" content="1200" /> */}
        {/* <meta property="og:image:height" content="630" /> */}

        {/* Twitter / iMessage */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Alua · Men's Breathwork & Surf Retreats" />
        <meta name="twitter:description" content="Breathwork and surf retreats for men. Slow down, get in the water, and meet yourself with an open heart." />

        {/* Theme */}
        <meta name="theme-color" content="#FAF7F4" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Prevent RN scroll issues */}
        <ScrollViewStyleReset />

        <style dangerouslySetInnerHTML={{ __html: `
          html, body { background-color: #FAF7F4; }
          #root { display: flex; flex: 1; min-height: 100vh; }

          /* Hero ambience: a slow drifting light gradient (sand + sea) with a
             soft glow that expands and contracts at a calm breathing pace. */
          @keyframes aluaDrift {
            0%   { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }
          @keyframes aluaBreath {
            0%, 100% { transform: translate(-50%, -50%) scale(0.9);  opacity: 0.38; }
            50%      { transform: translate(-50%, -50%) scale(1.16); opacity: 0.72; }
          }
          .alua-hero-bg {
            position: absolute; inset: 0;
            background: linear-gradient(140deg, #FAF7F4 0%, #ECE6DD 28%, #DCE8EA 55%, #F3ECE4 80%, #FAF7F4 100%);
            background-size: 220% 220%;
            animation: aluaDrift 26s ease-in-out infinite alternate;
          }
          .alua-breath {
            position: absolute; top: 44%; left: 50%;
            width: 72vmin; height: 72vmin; border-radius: 50%;
            background: radial-gradient(circle, rgba(196,149,106,0.30) 0%, rgba(124,160,150,0.12) 45%, rgba(196,149,106,0) 72%);
            filter: blur(30px); pointer-events: none;
            animation: aluaBreath 9s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .alua-hero-bg, .alua-breath { animation: none; }
          }
        `}} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
