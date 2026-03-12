export function AccessibilityPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display font-black text-shefel-red text-5xl text-center mb-8">
        הצהרת נגישות
      </h1>

      <div className="bg-shefel-red rounded-lg border-4 border-shefel-red p-8 space-y-6">
        <p className="font-body text-shefel-yellow text-lg leading-relaxed">
          בהצהרה זו מטרתנו לייעל את השימוש ולשפר את השירות שלנו בכל הנוגע
          לנגישות ושוויון זכויות לאנשים בעלי מוגבלויות.
        </p>

        <p className="font-body text-shefel-yellow text-lg leading-relaxed">
          לנגישות תכנים באינטרנט. אנו משתדלים לדבוק ככל הניתן בהמלצות התקן
          הישראלי ת&quot;י AA 5568
        </p>

        <p className="font-body text-shefel-yellow text-lg leading-relaxed">
          התאמת הנגישות נבדקה בדפדפנים כרום, פיירפוקס, ספארי, מוזילה ואדג&#39;.
        </p>

        <p className="font-body text-shefel-yellow text-lg leading-relaxed">
          <a
            href="https://www.isoc.org.il/about/accessibility-statement"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-shefel-white transition-colors"
          >
            הצהרת נגישות איגוד האינטרנט
          </a>
        </p>

        <h2 className="font-display font-bold text-shefel-yellow text-2xl pt-2">
          אמצעי נגישות הקיימים באתר:
        </h2>
        <ul className="font-body text-shefel-yellow text-lg leading-relaxed list-disc list-inside space-y-1">
          <li>
            תמיכה בכל הדפדפנים התקניים המקובלים (כמו Chrome, Explorer, FireFox,
            Opera, Mozila).
          </li>
          <li>תכני האתר נכתבו בשפה ברורה ונעשה שימוש בפונטים קריאים</li>
          <li>מבניות האתר בנויה מכותרות, פסקאות ורשימות</li>
          <li>
            התמצאות באתר היא פשוטה ונוחה וכוללת תפריטים זמינים וברורים
          </li>
          <li>
            הקישורים באתר ברורים ומסבירים להיכן מועברים לאחר לחיצה עליהם
          </li>
          <li>
            תיאור טקסטואלי לתמונות ואייקונים עבור טכנולוגיות מסייעות
          </li>
          <li>
            התאמת האתר לסביבות עבודה ברזולוציות שונות (רספונסיביות)
          </li>
          <li>
            הנגשת תפריטים, טפסים ושדות, היררכיית כותרות, רכיבי טאבים, חלונות
            קופצים ועוד
          </li>
        </ul>

        <h2 className="font-display font-bold text-shefel-yellow text-2xl pt-2">
          שינוי תצוגה באתר
        </h2>
        <p className="font-body text-shefel-yellow text-lg leading-relaxed">
          ניתן להגדיל או להקטין את תצוגת האתר באמצעות לחיצה על אחד מכפתורי ה-
          &quot;CTRL&quot; ביחד עם גלגלת העכבר או ביחד עם הסימן &quot;+&quot; עבור
          הגדלה או ביחד עם הסימן &quot;-&quot; עבור הקטנת התצוגה. כל לחיצה תקטין
          או תגדיל את המסך בעשרה אחוזים (10%)
        </p>
        <p className="font-body text-shefel-yellow text-lg leading-relaxed">
          שינוי גודל הגופן ייעשה באמצעות שימוש בתפריט הנגישות המצוי באתר
        </p>
        <p className="font-body text-shefel-yellow text-lg leading-relaxed">
          האתר אינו כולל הבהובים, ריצודים ותכנים בתנועה. במקומות אשר נמצאים
          תכנים כאלה, ניתן לעצור אותם בעמידה עליהם ולחיצה על העכבר
        </p>

        <h2 className="font-display font-bold text-shefel-yellow text-2xl pt-2">
          סייגים לנגישות
        </h2>
        <p className="font-body text-shefel-yellow text-lg leading-relaxed">
          הנהלת האתר עושה ככל שניתן על מנת לוודא כי כלל הדפים המוצגים יהיו
          מונגשים. יחד עם זאת אם נתקלתם בבעיה אנא צרו קשר עמנו בכדי שנוכל
          לעדכן את הנגישות.
        </p>

        <h2 className="font-display font-bold text-shefel-yellow text-2xl pt-2">
          נגישות פיזית
        </h2>
        <p className="font-body text-shefel-yellow text-lg leading-relaxed">
          אין קבלת קהל במשרדי החברה. השירות הוא שירות דיגיטלי בלבד.
        </p>

        <p className="font-body text-shefel-yellow text-lg leading-relaxed font-bold">
          נתקלתם בבעיה? אנחנו כאן כדי לסייע!
        </p>

        <h2 className="font-display font-bold text-shefel-yellow text-2xl pt-2">
          פרטי אחראי נגישות באתר:
        </h2>
        <p className="font-body text-shefel-yellow text-lg leading-relaxed">
          שם: שפל
        </p>
        <p className="font-body text-shefel-yellow text-lg leading-relaxed">
          אימייל:{' '}
          <a
            href="mailto:shefel@kaduregelshefel.com"
            className="underline hover:text-shefel-white transition-colors"
          >
            shefel@kaduregelshefel.com
          </a>
        </p>

        <p className="font-body text-shefel-yellow text-sm pt-4">
          תאריך עדכון להצהרת נגישות זו: 23.2.26
        </p>
      </div>
    </div>
  );
}
