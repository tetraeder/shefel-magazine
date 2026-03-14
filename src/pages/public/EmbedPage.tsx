export function EmbedPage() {
  return (
    <div className="-mx-4 -mt-4">
      <iframe
        src="https://kaduregelshefel-test.web.app/?embed&country=Israel"
        className="w-full border-none"
        style={{ height: 'calc(100vh - 80px)' }}
        title="כדורגל שפל"
        allow="autoplay; fullscreen"
      />
    </div>
  );
}
