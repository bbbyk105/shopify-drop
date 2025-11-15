import { ReactNode } from "react";
import MinecraftHeader from "@/components/minecraft/MinecraftHeader";
import MinecraftFooter from "@/components/minecraft/MinecraftFooter";

export default function MinecraftLayout({ children }: { children: ReactNode }) {
  return (
    <div className="minecraft-theme bg-[#8B7355] min-h-screen">
      <MinecraftHeader />
      <main>{children}</main>
      <MinecraftFooter />
    </div>
  );
}
