import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Dashboard Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">

          {/* Logo */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xl font-bold"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              ✓
            </span>

            <span>VeryfyKe</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center gap-2 text-sm">

            {/* Dashboard */}
            <Link
              href="/dashboard"
              className="rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              🏠 Dashboard
            </Link>

            {/* My Account */}
            <Link
              href="/dashboard/account"
              className="rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              👤 My Account
            </Link>

            {/* Police */}
            <Link
              href="/dashboard/police"
              className="rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              👮 Police
            </Link>

            {/* Land */}
            <Link
              href="/dashboard/land"
              className="rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              🏠 Land
            </Link>

            {/* Judicial */}
            <Link
              href="/dashboard/judicial"
              className="rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              ⚖️ Judicial
            </Link>

            {/* AOB */}
            <Link
              href="/dashboard/aob"
              className="rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              📢 AOB
            </Link>

          </div>
        </div>
      </nav>

      {/* Current Dashboard Page */}
      {children}

    </div>
  );
}