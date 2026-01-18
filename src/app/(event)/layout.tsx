import { ReactNode } from "react";
import MineLightHeader from "@/components/minelight/MineLightHeader";
import MineLightFooter from "@/components/minelight/MineLightFooter";

export default function EventLayout({ children }: { children: ReactNode }) {
  return (
    <div className="minecraft-theme bg-[#8B7355] min-h-screen flex flex-col">
      <MineLightHeader />
      <main className="flex-1">{children}</main>
      <MineLightFooter />
    </div>
  );
}
