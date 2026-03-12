export function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display font-black text-shefel-red text-5xl text-center mb-8">
        עלינו
      </h1>

      <div className="bg-shefel-red rounded-lg border-4 border-shefel-red p-8 space-y-6">
        <p className="font-body text-shefel-yellow text-lg leading-relaxed">
          פרויקט תרבות הכדורגל של ישראל – חולצות כדורגל, תרבות אוהדים, דוקו בוידאו וסטילס, גביע השפל, ושלל אירועי תרבות כדורגל שמטרתם אחת – לחבר את החברה הישראלית באמצעות כדורגל.
        </p>

        <p className="font-body text-shefel-yellow text-lg leading-relaxed">
          המסע שלנו התחיל מסקרנות לגלות עולם ואנשים שנמצאים קרוב אלינו ושמעולם לא פגשנו, והמטרה שלנו היא שאתם ואתן תצאו מהבית, תטיילו בארץ כשהכדורגל הוא רק תירוץ, ותחוו את המקום הקטן והיפהפה הזה שאנחנו חיים בו.
        </p>

        <img
          src="/aboutus.png"
          alt="כדורגל שפל"
          className="w-full rounded-lg"
        />

        <p className="font-body text-shefel-yellow text-lg leading-relaxed">
          לאורך השנים נבנתה קהילת כדורגל שפל שלא תלויה באהבה לכדורגל – קהילה מגוונת מבחינה מגדרית, מגזרית, ועם טווח גילאים רחב מאוד.
        </p>

        <p className="font-body text-shefel-yellow text-lg leading-relaxed">
          כדורגל שפל התחיל מנסיעה אחת לאום אל-פאחם, שם התחלנו לצלם בשביל הכיף שלנו, מה שהפך לתערוכת צילום שהוצגה בכל הארץ והעולם, סדרות רשת, תיעודים בוידאו מכל הארץ, חנות פופ-אפ לחולצות כדורגל (השפל שופ), גביע השפל, אלבומי מדבקות, ועוד המון אירועים., כשחלק גדול מהיצירה הוא אתם – חברי קהילת כדורגל שפל, שמוכיחים פעם אחר פעם שיש כאן קהל לתרבות כדורגל חיובית.
        </p>
      </div>
    </div>
  );
}
