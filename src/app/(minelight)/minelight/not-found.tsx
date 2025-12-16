import Link from "next/link";
import MineLightButton from "@/components/minelight/MineLightButton";

export default function MineLightNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-yellow-400 mb-4 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] font-minecraft">
          404
        </h1>
        <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] font-minecraft">
          BLOCK NOT FOUND
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          Looks like this block doesn&apos;t exist in our world...
        </p>
        <Link href="/minelight">
          <MineLightButton variant="primary" size="lg">
            RETURN TO BASE
          </MineLightButton>
        </Link>
      </div>
    </div>
  );
}
