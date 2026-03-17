import { useState, useCallback, useRef, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAppDb } from '../../firebase';
import { NAMES } from '../../data/names';
import { trackNameSpin, trackNameSuggest, trackCTAClick, trackNameRate } from '../../lib/analytics';

function getRandomName(exclude?: string): string {
  let name: string;
  do {
    name = NAMES[Math.floor(Math.random() * NAMES.length)];
  } while (name === exclude && NAMES.length > 1);
  return name;
}

interface Star {
  id: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
  size: number;
  delay: number;
}

export function NameGeneratorPage() {
  const [displayName, setDisplayName] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('n') || getRandomName();
  });
  const [isSpinning, setIsSpinning] = useState(false);
  const [isRevealed, setIsRevealed] = useState(true);
  const [showSuggest, setShowSuggest] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [copied, setCopied] = useState(false);
  const [stars, setStars] = useState<Star[]>([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingLocked, setRatingLocked] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const starIdRef = useRef(0);

  const makeStars = (count: number, minDist: number, maxDist: number) =>
    Array.from({ length: count }, () => {
      const angle = Math.random() * 360;
      const distance = minDist + Math.random() * maxDist;
      return {
        id: starIdRef.current++,
        x: 0,
        y: 0,
        angle,
        distance,
        size: 10 + Math.random() * 16,
        delay: Math.random() * 0.6,
      };
    });

  const handleNameClick = useCallback(() => {
    if (isSpinning) return;
    const url = `${window.location.origin}/name?n=${encodeURIComponent(displayName)}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);

    setStars(makeStars(100, 40, 180));
    setTimeout(() => setStars([]), 2500);
  }, [isSpinning, displayName]);

  const handleRate = useCallback(async (value: number) => {
    if (ratingLocked) return;
    setRating(value);
    setRatingLocked(true);
    trackNameRate(displayName, value);
    if (value === 5) {
      setStars(makeStars(100, 40, 180));
      setTimeout(() => setStars([]), 2500);
    }
    try {
      const db = getAppDb();
      await addDoc(collection(db, 'nameRatings'), {
        name: displayName,
        rating: value,
        createdAt: serverTimestamp(),
      });
    } catch {
      // silent fail — analytics still tracks it
    }
  }, [ratingLocked, displayName]);

  const spin = useCallback(() => {
    if (isSpinning) return;
    setIsSpinning(true);
    setIsRevealed(false);
    setRating(0);
    setRatingLocked(false);
    setHoverRating(0);

    let speed = 50;
    let elapsed = 0;
    const totalDuration = 2000;

    const tick = () => {
      setDisplayName(getRandomName());
      elapsed += speed;

      if (elapsed >= totalDuration) {
        if (intervalRef.current) clearTimeout(intervalRef.current);
        const finalName = getRandomName();
        setDisplayName(finalName);
        setIsSpinning(false);
        setIsRevealed(true);
        trackNameSpin(finalName);
        return;
      }

      // Slow down gradually
      speed = 50 + (elapsed / totalDuration) * 250;
      intervalRef.current = setTimeout(tick, speed);
    };

    intervalRef.current = setTimeout(tick, speed);
  }, [isSpinning]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <h1 className="font-display font-black text-shefel-red text-4xl md:text-5xl text-center">
        שם מפעם
      </h1>

      <div className="relative w-full">
        {/* Decorative frame */}
        <div className="bg-shefel-red rounded-2xl border-4 border-shefel-red p-2">
          <div className="bg-shefel-yellow rounded-xl border-4 border-shefel-yellow-light overflow-hidden">
            {/* Name display */}
            <div
              className={`relative flex items-center justify-center h-32 md:h-40 ${!isSpinning ? 'cursor-pointer' : ''}`}
              onClick={handleNameClick}
            >
              {/* Slot machine lines */}
              <div className="absolute inset-x-0 top-0 h-px bg-shefel-red/20" />
              <div className="absolute inset-x-0 bottom-0 h-px bg-shefel-red/20" />

              <p
                className={`font-display font-black text-shefel-red text-4xl md:text-6xl text-center transition-all duration-300 select-none ${
                  isSpinning
                    ? 'blur-[6px] scale-95 opacity-50'
                    : isRevealed
                      ? 'blur-0 scale-100 opacity-100'
                      : ''
                }`}
                style={
                  isRevealed && !isSpinning
                    ? { animation: 'nameReveal 0.5s ease-out' }
                    : undefined
                }
              >
                {displayName}
              </p>

            </div>
          </div>
        </div>

        {/* Copied tooltip - starts from center of name */}
        {copied && (
          <span className="absolute top-1/2 left-1/2 z-50 bg-shefel-red text-shefel-yellow text-lg font-display font-bold px-5 py-2 rounded-xl whitespace-nowrap animate-fade-in shadow-lg">
            קישור הועתק בהצלחה!
          </span>
        )}

        {/* Star burst animation - outside overflow-hidden */}
        {stars.map((star) => (
          <span
            key={star.id}
            className="absolute pointer-events-none z-40"
            style={{
              left: '50%',
              top: '50%',
              fontSize: `${star.size}px`,
              animation: `starBurst 1.2s ease-out ${star.delay}s forwards`,
              '--star-x': `${Math.cos((star.angle * Math.PI) / 180) * star.distance}px`,
              '--star-y': `${Math.sin((star.angle * Math.PI) / 180) * star.distance}px`,
            } as React.CSSProperties}
          >
            ⭐
          </span>
        ))}

        {/* Rotating border shine effect */}
        {!isSpinning && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              padding: '3px',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
              animation: 'borderRotate 6s linear infinite',
              background: 'conic-gradient(from var(--shine-angle, 0deg), transparent 0%, transparent 30%, rgba(255,194,0,0.8) 45%, rgba(255,255,255,0.9) 50%, rgba(255,194,0,0.8) 55%, transparent 70%, transparent 100%)',
            }}
          />
        )}
      </div>

      {/* Star rating — always takes space to prevent layout jump */}
      <div className="relative flex items-center justify-center h-12 transition-all duration-500">
        {isSpinning ? (
          <div className="flex gap-2" dir="ltr">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="text-3xl md:text-4xl select-none"
                style={{
                  WebkitTextStroke: '2px #CC0000',
                  color: 'transparent',
                  filter: 'drop-shadow(0 1px 2px rgba(204,0,0,0.3))',
                  animation: `starLoading 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              >
                ☆
              </span>
            ))}
          </div>
        ) : isRevealed ? (
          <div className="flex gap-2" dir="ltr">
            {[1, 2, 3, 4, 5].map((value, i) => {
              const active = value <= (hoverRating || rating);
              return (
                <button
                  key={value}
                  onClick={() => handleRate(value)}
                  onMouseEnter={() => !ratingLocked && setHoverRating(value)}
                  onMouseLeave={() => !ratingLocked && setHoverRating(0)}
                  className="text-3xl md:text-4xl cursor-pointer select-none"
                  style={{
                    animation: `starBounceIn 0.4s ease-out ${i * 0.08}s both`,
                    transform: active ? 'scale(1.2)' : 'scale(1)',
                    filter: active
                      ? 'drop-shadow(0 0 6px rgba(255,194,0,0.8)) drop-shadow(0 0 2px rgba(204,0,0,0.5))'
                      : 'drop-shadow(0 1px 2px rgba(204,0,0,0.3))',
                    transition: 'transform 0.2s, filter 0.2s',
                    WebkitTextStroke: active ? '0' : '2px #CC0000',
                    color: active ? '' : 'transparent',
                  }}
                >
                  {active ? '⭐' : '☆'}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <button
        onClick={spin}
        disabled={isSpinning}
        className={`font-display font-black text-2xl md:text-3xl px-10 py-4 rounded-xl border-4 transition-all duration-200 cursor-pointer ${
          isSpinning
            ? 'bg-shefel-red/60 text-shefel-yellow/60 border-shefel-red/40 cursor-not-allowed scale-95'
            : 'bg-shefel-red text-shefel-yellow border-shefel-red hover:bg-shefel-yellow hover:text-shefel-red hover:border-shefel-red hover:scale-105 active:scale-95'
        }`}
      >
        {isSpinning ? 'מגריל...' : 'תן לי שם מפעם!'}
      </button>

      <button
        onClick={() => { trackCTAClick('suggest_name', 'name_page'); setShowSuggest(true); }}
        className="font-body text-shefel-red/70 text-xl md:text-2xl underline underline-offset-4 hover:text-shefel-red transition-colors cursor-pointer"
      >
        רוצים להציע שם מפעם?
      </button>

      <a
        href="https://chat.whatsapp.com/LKKKpvIXe6t0dBnJfqZedd?mode=gi_t"
        target="_blank"
        rel="noopener noreferrer"
        className="font-body text-shefel-red/70 text-xl md:text-2xl underline underline-offset-4 hover:text-shefel-red transition-colors"
      >
        לקבוצת הווצאפ ׳זוכרים את׳
      </a>

      {showSuggest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSuggest(false);
          }}
        >
          <div className="bg-shefel-yellow rounded-2xl border-4 border-shefel-red p-8 mx-4 w-full max-w-md space-y-6">
            <h2 className="font-display font-black text-shefel-red text-2xl text-center">
              הציעו שם מפעם
            </h2>

            <div className="space-y-4">
              <div>
                <label className="font-body text-shefel-red font-bold block mb-1">שם פרטי מפעם</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border-2 border-shefel-red rounded-lg px-4 py-2 font-body text-lg bg-white focus:outline-none focus:border-shefel-black"
                />
              </div>
              <div>
                <label className="font-body text-shefel-red font-bold block mb-1">שם משפחה מפעם</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border-2 border-shefel-red rounded-lg px-4 py-2 font-body text-lg bg-white focus:outline-none focus:border-shefel-black"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  trackNameSuggest(firstName, lastName);
                  // TODO: handle submission (e.g. save to Firestore)
                  setShowSuggest(false);
                  setFirstName('');
                  setLastName('');
                }}
                disabled={!firstName.trim() && !lastName.trim()}
                className="font-display font-bold text-lg bg-shefel-red text-shefel-yellow px-6 py-2 rounded-lg hover:bg-shefel-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                שליחה
              </button>
              <button
                onClick={() => setShowSuggest(false)}
                className="font-display font-bold text-lg border-2 border-shefel-red text-shefel-red px-6 py-2 rounded-lg hover:bg-shefel-red/10 transition-colors cursor-pointer"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes nameReveal {
          0% {
            transform: scale(1.3);
            opacity: 0;
            filter: blur(8px);
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
            filter: blur(2px);
          }
          100% {
            transform: scale(1);
            opacity: 1;
            filter: blur(0);
          }
        }
        @property --shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes borderRotate {
          0% {
            --shine-angle: 0deg;
          }
          100% {
            --shine-angle: 360deg;
          }
        }
        @keyframes starBurst {
          0% {
            transform: translate(-50%, -50%) translate(0, 0) scale(1);
            opacity: 1;
          }
          20% {
            transform: translate(-50%, -50%) translate(calc(var(--star-x) * 0.4), calc(var(--star-y) * 0.4)) scale(1.3);
            opacity: 1;
          }
          70% {
            transform: translate(-50%, -50%) translate(var(--star-x), var(--star-y)) scale(1);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) translate(calc(var(--star-x) * 1.2), calc(var(--star-y) * 1.2)) scale(0);
            opacity: 0;
          }
        }
        @keyframes popFloat {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          10% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
          20% { transform: translate(-50%, calc(-50% - 20px)) scale(1); opacity: 1; }
          60% { opacity: 1; transform: translate(-50%, calc(-50% - 60px)) scale(1); }
          100% { opacity: 0; transform: translate(-50%, calc(-50% - 100px)) scale(0.8); }
        }
        .animate-fade-in {
          animation: popFloat 2.2s ease-out forwards;
        }
        @keyframes starLoading {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.3);
            opacity: 1;
          }
        }
        @keyframes starBounceIn {
          0% {
            opacity: 0;
            transform: scale(0) translateY(10px);
          }
          60% {
            opacity: 1;
            transform: scale(1.3) translateY(-4px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
