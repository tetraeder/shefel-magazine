import { SocialLinks } from './SocialLinks';

export function Footer() {
  return (
    <footer className="bg-shefel-red px-4 py-6 mt-auto">
      <div className="max-w-6xl mx-auto text-center font-display text-sm text-shefel-yellow">
        <SocialLinks
          showLabels
          className="md:hidden flex flex-wrap justify-center gap-4 mb-4"
          linkClassName="flex items-center gap-1.5 text-shefel-yellow hover:text-shefel-white transition-colors no-underline font-display font-bold text-sm"
          iconClassName="w-4 h-4"
        />
        <p className="font-bold">&copy; {new Date().getFullYear()} כדורגל שפל. כל הזכויות שמורות.</p>
        <a
          href="https://shefelstudio.com/acc/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-shefel-yellow/70 hover:text-shefel-white transition-colors no-underline font-display text-xs"
        >
          הצהרת נגישות
        </a>
      </div>
    </footer>
  );
}
