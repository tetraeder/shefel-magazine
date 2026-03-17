import { useState, useCallback, useRef, useEffect } from 'react';
import { NAMES } from '../../data/names';
import { trackNameSpin, trackNameSuggest, trackCTAClick } from '../../lib/analytics';

function getRandomName(exclude?: string): string {
  let name: string;
  do {
    name = NAMES[Math.floor(Math.random() * NAMES.length)];
  } while (name === exclude && NAMES.length > 1);
  return name;
}

export function NameGeneratorPage() {
  const [displayName, setDisplayName] = useState(() => getRandomName());
  const [isSpinning, setIsSpinning] = useState(false);
  const [isRevealed, setIsRevealed] = useState(true);
  const [showSuggest, setShowSuggest] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const spin = useCallback(() => {
    if (isSpinning) return;
    setIsSpinning(true);
    setIsRevealed(false);

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
            <div className="relative flex items-center justify-center h-32 md:h-40">
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
        className="font-body text-shefel-red/70 text-lg underline underline-offset-4 hover:text-shefel-red transition-colors cursor-pointer"
      >
        רוצים להציע שם מפעם?
      </button>

      <a
        href="https://chat.whatsapp.com/LKKKpvIXe6t0dBnJfqZedd?mode=gi_t"
        target="_blank"
        rel="noopener noreferrer"
        className="font-body text-shefel-red/70 text-lg underline underline-offset-4 hover:text-shefel-red transition-colors"
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
      `}</style>
    </div>
  );
}
