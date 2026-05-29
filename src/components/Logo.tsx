import Image from "next/image";
import { assets } from "@/lib/assets";

export function Logo({ className = "h-9 w-auto" }: { className?: string }) {
  return (
    <Image
      src={assets.logo}
      alt="ARKHE"
      width={120}
      height={40}
      className={`object-contain object-left mix-blend-screen ${className}`}
      priority
    />
  );
}
