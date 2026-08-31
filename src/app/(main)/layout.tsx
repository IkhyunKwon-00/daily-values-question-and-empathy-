import Nav from "@/components/Nav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/80 backdrop-blur">
        <div className="mx-auto flex max-w-xl items-center px-4 py-2.5">
          <span className="font-logo text-3xl leading-none text-clay">
            Daily Value
          </span>
        </div>
      </header>
      <main className="mx-auto w-full max-w-xl px-4 pb-28 pt-5">
        {children}
      </main>
      <Nav />
    </div>
  );
}
