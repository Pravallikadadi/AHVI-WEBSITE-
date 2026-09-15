import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[600px] px-6 py-28 text-center">
      <h1 className="mb-4 font-condensed text-[32px] font-semibold">Page not found.</h1>
      <Link href="/" className="text-[13px] tracking-[0.1em] text-accent">
        Back home
      </Link>
    </div>
  );
}
