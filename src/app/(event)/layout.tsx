import { ReactNode } from "react";
import MineLightHeader from "@/components/minelight/MineLightHeader";
import MineLightFooter from "@/components/minelight/MineLightFooter";

export default function EventLayout({ children }: { children: ReactNode }) {
  return (
    <div className="minecraft-theme bg-[#8B7355] min-h-screen">
      <MineLightHeader />
      <main>{children}</main>
      <MineLightFooter />
    </div>
  );
}
