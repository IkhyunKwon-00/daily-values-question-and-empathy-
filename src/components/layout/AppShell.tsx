import type { ReactNode } from "react";
import AppHeader from "@/components/layout/AppHeader";
import Nav from "@/components/Nav";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-paper">
      <Nav />

      <div className="lg:pl-64">
        <AppHeader />

        <main className="mx-auto w-full max-w-2xl animate-fade-up px-5 pb-28 pt-6 motion-reduce:animate-none sm:px-8 sm:pt-8 lg:pb-16">
          {children}
        </main>
      </div>
    </div>
  );
}