export function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
      <div className="w-14 h-14 border-[5px] border-shefel-red/30 border-t-shefel-red rounded-full animate-spin" />
      <p className="font-display font-bold text-shefel-red/60 text-xl">טוען תוכן</p>
    </div>
  );
}
