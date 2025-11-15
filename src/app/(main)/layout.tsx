import { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="min-h-screen">{children}</main>
    </>
  );
}
