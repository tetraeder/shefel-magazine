import { useMemo } from 'react';
import { useMedia } from '../../hooks/useMedia';
import { useTags } from '../../hooks/useTags';
import { MediaCard } from '../../components/magazine/MediaCard';
import type { Tag } from '../../types/tag';

export function FestivalPage() {
  const { media } = useMedia();
  const { tags } = useTags();

  const tagsMap: Record<string, Tag> = {};
  for (const tag of tags) {
    tagsMap[tag.id] = tag;
  }

  const shefelTag = tags.find((t) => t.name === 'שפל בדרכים');
  const shefelMedia = useMemo(() => {
    if (!shefelTag) return [];
    return media
      .filter((m) => m.tags.includes(shefelTag.id))
      .sort((a, b) => {
        const aTime = a.publishedAt?.toMillis() ?? a.createdAt.toMillis();
        const bTime = b.publishedAt?.toMillis() ?? b.createdAt.toMillis();
        return bTime - aTime;
      });
  }, [media, shefelTag]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-center mb-8">
        <img
          src="/90.png"
          alt="פסטיבל 90 שניות"
          className="h-24"
        />
      </div>
      <div className="bg-shefel-red rounded-lg border-4 border-shefel-red p-8 space-y-6">
        <p className="font-display font-bold text-shefel-yellow text-2xl leading-relaxed text-center">
          הקרן ע&quot;ש מודי בר-און, משפחתו, שבח הנדסה וכדורגל שפל גאים להציג
        </p>

        <h2 className="font-display font-black text-shefel-yellow text-4xl text-center">
          90 שניות – נסיעה למשחק
        </h2>

        <p className="font-display font-bold text-shefel-yellow text-xl text-center">
          פסטיבל סרטונים נושא פרסים
        </p>

        <p className="font-body text-shefel-yellow text-2xl leading-relaxed">
          צאו החוצה, סעו למקומות שלא הייתם בהם אף פעם ותחוו את הקסם.
          <br />
          צלמו וערכו לסרטון בנושא &quot;נסיעה למשחק&quot; באורך 90 שניות ושלחו אלינו.
        </p>

        <p className="font-body text-shefel-yellow text-2xl leading-relaxed">
          הכדורגל שלנו הוא מעבר למשחק של 90 דקות. הוא חוויה של שותפות, של יצרים, של מפגש, הוא מיקרו-קוסמוס של התרבות בה אנחנו חיים.
        </p>

        <p className="font-body text-shefel-yellow text-2xl leading-relaxed">
          אנחנו חיים במקום מיוחד, מגוון, ויפהפה. הנופים והתרבות פה ייחודיים ומרגשים. ההתרגשות לפני המשחק, הנסיעה אליו והמפגש עם מקומות וקבוצות אחרות הוא הזדמנות. אנחנו מזמינים אתכם להיות סוכנים של תרבות כדורגל יפה ומקרבת.
        </p>

        <p className="font-body text-shefel-yellow text-2xl leading-relaxed">
          המשחק יכול להיות משחק רשמי, בשכונה, ליגה למקומות עבודה או כל משחק כדורגל שאתם רוצים שנכיר.
          <br />
          אפשר לעשות דוקו, עלילתי, קליפ, וולוג או דבר אחר שעולה לכם ולכן בראש.
        </p>

        <div className="border-2 border-shefel-yellow rounded-lg p-6 space-y-3">
          <p className="font-display font-bold text-shefel-yellow text-xl">
            על הסרטון לכלול:
          </p>
          <ul className="font-body text-shefel-yellow text-2xl leading-relaxed list-disc list-inside space-y-2">
            <li>
              סימון דרך – שילוט כבישים, שילוט בית עסק, מתנ&quot;ס או כל דבר אחר שיסמן לנו איפה אנחנו נמצאים.
            </li>
            <li>גרעינים שחורים (גרעיני חמניה)</li>
            <li>חולצת כדורגל</li>
          </ul>
        </div>

        <div className="border-2 border-shefel-yellow rounded-lg p-6 space-y-3">
          <p className="font-display font-bold text-shefel-yellow text-xl">
            חשוב לדעת:
          </p>
          <ul className="font-body text-shefel-yellow text-2xl leading-relaxed list-disc list-inside space-y-2">
            <li>
              אסור – שפה פוגענית, מזלזלת, גזענות ושאר דברים פוגעניים. המטרה היא להנגיש את תרבות הכדורגל בישראל בצורה חיובית ומקרבת.
            </li>
            <li>
              אין בעיה להשתמש בחומרי ארכיון, אבל חובה שלפחות חצי מהסרטון יהיה מורכב מחומר שצולם בחודש מרץ 2026.
            </li>
            <li>אסור שימוש ב-AI.</li>
          </ul>
        </div>

        <div className="bg-shefel-yellow rounded-lg p-6 text-center space-y-4">
          <p className="font-display font-black text-shefel-red text-2xl">
            הגשת הקובץ הסופי עד 1.4.2026
          </p>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSf8MElPeguaju8jrSaPiDupLmFidvK8h3i4a__F-to2UJmYCg/viewform?usp=dialog"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-shefel-red text-shefel-yellow font-display font-bold text-xl px-8 py-3 rounded-lg hover:bg-shefel-black transition-colors no-underline"
          >
            להגשת סרטון
          </a>
        </div>

        <div className="space-y-3 text-center">
          <p className="font-display font-bold text-shefel-yellow text-xl">
            הפרסים:
          </p>
          <p className="font-body text-shefel-yellow text-2xl">
            ✷ אירוע הקרנה חגיגי והכרזה על הזוכים
          </p>
          <p className="font-body text-shefel-yellow text-2xl">
            ✷ הצגה באתר ייעודי ובחשבון האינסטגרם של כדורגל שפל
          </p>
          <p className="font-body text-shefel-yellow text-2xl">
            ✷ פרסים כספיים לעשרת הסרטונים המובילים
          </p>
        </div>
      </div>

      {shefelMedia.length > 0 && (
        <div className="mt-12">
          <h2 className="font-display font-black text-shefel-red text-3xl text-center mb-6">
            שפל בדרכים
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {shefelMedia.map((item) => (
              <MediaCard key={item.id} item={item} tagsMap={tagsMap} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
