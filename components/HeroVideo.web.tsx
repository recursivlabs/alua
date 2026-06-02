import { useRef, useEffect } from 'react';

/**
 * Web hero video. Uses a raw <video> so autoplay is reliable: browsers only
 * allow autoplay when the element is muted AND that's true at play() time, so
 * we set muted imperatively and retry play() on canplay.
 */
export function HeroVideo({ uri }: { uri: string }) {
  const ref = useRef<any>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    const tryPlay = () => {
      const p = v.play?.();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    };
    tryPlay();
    v.addEventListener('canplay', tryPlay, { once: true });
    v.addEventListener('loadeddata', tryPlay, { once: true });
    return () => {
      v.removeEventListener('canplay', tryPlay);
      v.removeEventListener('loadeddata', tryPlay);
    };
  }, []);

  return (
    <video
      ref={ref}
      src={uri}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      // @ts-ignore web-only DOM element inside the RN-web tree
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        pointerEvents: 'none',
      }}
    />
  );
}
