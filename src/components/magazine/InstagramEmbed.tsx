import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

let scriptLoaded = false;

function ensureEmbedScript() {
  if (scriptLoaded) return;
  scriptLoaded = true;
  const script = document.createElement('script');
  script.src = 'https://www.instagram.com/embed.js';
  script.async = true;
  document.body.appendChild(script);
}

interface InstagramEmbedProps {
  url: string;
}

export function InstagramEmbed({ url }: InstagramEmbedProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureEmbedScript();

    // Give the script time to load, then process embeds
    const timer = setTimeout(() => {
      window.instgrm?.Embeds.process();
    }, 500);

    return () => clearTimeout(timer);
  }, [url]);

  // Extract the clean URL (remove query params)
  const cleanUrl = url.replace(/\?.*$/, '');

  return (
    <div ref={ref} className="instagram-embed-container">
      <blockquote
        className="instagram-media"
        data-instgrm-captioned
        data-instgrm-permalink={cleanUrl}
        style={{
          background: '#FFF',
          border: 0,
          borderRadius: '3px',
          boxShadow: 'none',
          margin: '0',
          maxWidth: '100%',
          minWidth: '100%',
          padding: 0,
          width: '100%',
        }}
      />
    </div>
  );
}
