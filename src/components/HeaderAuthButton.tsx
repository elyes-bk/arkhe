"use client";

import Link from "next/link";
import { logout } from "@/actions/auth";

interface HeaderAuthButtonProps {
  isLoggedIn: boolean;
  className?: string;
}

export default function HeaderAuthButton({
  isLoggedIn,
  className = "",
}: HeaderAuthButtonProps) {
  if (isLoggedIn) {
    return (
      <form action={logout}>
        <button
          type="submit"
          className={`rounded bg-white/10 px-3 py-1.5 font-kumbh text-xs font-medium text-white transition-opacity hover:bg-white/20 sm:text-sm ${className}`}
        >
          Se déconnecter
        </button>
      </form>
    );
  }

  return (
    <Link
      href="/register"
      className={`rounded bg-arkhe-blue px-3 py-1.5 font-kumbh text-xs font-medium text-white transition-opacity hover:opacity-90 sm:text-sm ${className}`}
    >
      Rejoindre
    </Link>
  );
}
