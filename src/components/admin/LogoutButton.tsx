"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-sm border border-ivory/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-ivory/80 hover:border-gold hover:text-gold"
    >
      Se déconnecter
    </button>
  );
}
