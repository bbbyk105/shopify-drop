import Link from "next/link";

export default function TopBar() {
  return (
    <div className="bg-gray-900 text-white text-sm py-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center">
          <p className="text-center">
            Get financing as low as 0% APR for up to 12 months.{" "}
            <Link
              href="/financing"
              className="underline hover:no-underline transition-all"
            >
              Learn more.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
