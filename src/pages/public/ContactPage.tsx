export function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display font-black text-shefel-red text-5xl text-center mb-8">
        דברו איתנו
      </h1>

      <div className="bg-shefel-red rounded-lg border-4 border-shefel-red p-8 space-y-6">
        <h3 className="font-display font-bold text-shefel-yellow text-2xl leading-relaxed">
          היי! אפשר לדבר איתנו באינסטגרם של{' '}
          <a
            href="https://www.instagram.com/kaduregelshefel/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-shefel-white transition-colors"
          >
            כדורגל שפל
          </a>{' '}
          או{' '}
          <a
            href="https://www.instagram.com/shefelshop/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-shefel-white transition-colors"
          >
            השפל שופ
          </a>{' '}
          בכל עניין
        </h3>

        <p className="font-body text-shefel-yellow text-lg leading-relaxed">
          ליגה – פוטלגים ושחזורים, באינסטגרם של ליגה
        </p>

        <p className="font-body text-shefel-yellow text-lg leading-relaxed">
          או בכתובת מייל –{' '}
          <a
            href="mailto:shefel@kaduregelshefel.com"
            className="underline hover:text-shefel-white transition-colors"
          >
            shefel@kaduregelshefel.com
          </a>
        </p>

        <p className="font-body text-shefel-yellow text-lg leading-relaxed">
          להרשמה לניוזלטר ועדכונים טקסט{' '}
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdaVclAPwJ641OeXIO23DT3GZ9vALegcOyDy78FQR1gozkGiQ/viewform?usp=dialog"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-shefel-white transition-colors"
          >
            בלינק
          </a>
        </p>
      </div>
    </div>
  );
}
