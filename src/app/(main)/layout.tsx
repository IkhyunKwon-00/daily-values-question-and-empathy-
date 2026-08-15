import Nav from "@/components/Nav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh md:pt-0">
      <Nav />
      <main className="mx-auto w-full max-w-xl px-4 pb-24 pt-6 md:pb-12">
        {children}
      </main>
    </div>
  );
}
