export default function MainLoading() {
  return (
    <div role="status" aria-label="오늘의 생각을 불러오는 중">
      <section className="border-b border-line/70 pb-12 pt-4 sm:pb-16 sm:pt-8">
        <div className="h-3 w-20 animate-pulse bg-paper-raise" />
        <div className="mt-6 h-12 w-full max-w-lg animate-pulse bg-paper-raise" />
        <div className="mt-3 h-12 w-3/4 max-w-sm animate-pulse bg-paper-raise" />
        <div className="mt-8 h-12 w-36 animate-pulse bg-paper-raise" />
      </section>
      <div className="pt-10 sm:pt-14">
        {[0, 1, 2].map((item) => (
          <div key={item} className="border-b border-line/60 py-10 sm:py-14" aria-hidden>
            <div className="h-3 w-24 animate-pulse bg-paper-raise" />
            <div className="mt-6 h-6 w-full animate-pulse bg-paper-raise" />
            <div className="mt-3 h-6 w-5/6 animate-pulse bg-paper-raise" />
          </div>
        ))}
      </div>
    </div>
  );
}