import { SocialLinks } from './SocialLinks';

export function Footer() {
  return (
    <footer className="bg-shefel-red px-4 py-6 mt-auto">
      <div className="max-w-6xl mx-auto text-center font-body text-sm text-shefel-yellow">
        <SocialLinks
          showLabels
          className="md:hidden flex flex-wrap justify-center gap-4 mb-4"
          linkClassName="flex items-center gap-1.5 text-shefel-yellow hover:text-shefel-white transition-colors no-underline font-body text-sm"
          iconClassName="w-4 h-4"
        />
        <p>&copy; {new Date().getFullYear()} כדורגל שפל. כל הזכויות שמורות.</p>
      </div>
    </footer>
  );
}
