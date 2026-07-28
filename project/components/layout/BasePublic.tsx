//modified

import type { ReactNode } from "react";
import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/header/Header";

export default function BasePublic({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-950 text-slate-100">
      <Header />
      <main className="flex-1 w-full overflow-x-hidden">{children}</main>
      <Footer />
    </div>
  );
}
