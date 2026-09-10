"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          router.push("/login");
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error("Unable to load user:", error);
        router.push("/login");
      } finally {
        setLoadingUser(false);
      }
    }

    loadUser();
  }, [router]);

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        router.push("/login");
        router.refresh();
      } else {
        alert("Logout failed.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed.");
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-fixed px-6 py-10 text-white"
      style={{ backgroundImage: "url('/dashboard.jpeg')" }}
    >
      {/* Background Overlay */}
      {/* pointer-events-none prevents the overlay from blocking clicks */}
      <div className="pointer-events-none fixed inset-0 bg-slate-950/40" />

      {/* Dashboard Content */}
      <div className="relative z-10 mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-10 flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold drop-shadow-lg">
              VeryfyKe Dashboard
            </h1>

            <p className="mt-2 text-slate-200 drop-shadow">
              Credential verification and reporting portal
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-red-300/20 bg-red-600/80 px-5 py-3 font-semibold shadow-lg backdrop-blur-sm transition hover:bg-red-500"
          >
            Logout
          </button>

        </div>

        {/* Welcome */}
        <div className="mb-8 rounded-2xl border border-white/20 bg-slate-950/40 p-6 shadow-2xl backdrop-blur-md">

          <h2 className="text-xl font-semibold">
            {loadingUser
              ? "Welcome to VeryfyKe"
              : `Welcome, ${user?.name}`}
          </h2>

          <p className="mt-2 text-slate-200">
            Select a department below to verify official credentials
            or submit a report or feedback.
          </p>

        </div>

        {/* My Account */}
        <div className="mb-8 rounded-2xl border border-blue-300/20 bg-slate-950/40 p-6 shadow-2xl backdrop-blur-md">

          <div className="mb-6 flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-blue-300/30 bg-blue-600/80 text-2xl font-bold shadow-lg backdrop-blur-sm">
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                My Account
              </h2>

              <p className="text-sm text-slate-300">
                Your VeryfyKe account information
              </p>
            </div>

          </div>

          {loadingUser ? (
            <div className="rounded-xl border border-white/10 bg-black/20 py-6 text-center text-slate-300 backdrop-blur-sm">
              Loading account information...
            </div>
          ) : user ? (
            <div className="grid gap-4 md:grid-cols-2">

              {/* Full Name */}
              <div className="rounded-xl border border-white/15 bg-black/25 p-4 backdrop-blur-sm transition hover:bg-black/35">

                <p className="text-sm text-slate-300">
                  Full Name
                </p>

                <p className="mt-1 font-semibold">
                  {user.name}
                </p>

              </div>

              {/* Email */}
              <div className="rounded-xl border border-white/15 bg-black/25 p-4 backdrop-blur-sm transition hover:bg-black/35">

                <p className="text-sm text-slate-300">
                  Email Address
                </p>

                <p className="mt-1 break-all font-semibold">
                  {user.email}
                </p>

              </div>

              {/* Phone */}
              <div className="rounded-xl border border-white/15 bg-black/25 p-4 backdrop-blur-sm transition hover:bg-black/35">

                <p className="text-sm text-slate-300">
                  Phone Number
                </p>

                <p className="mt-1 font-semibold">
                  {user.phone || "Not provided"}
                </p>

              </div>

              {/* Role */}
              <div className="rounded-xl border border-white/15 bg-black/25 p-4 backdrop-blur-sm transition hover:bg-black/35">

                <p className="text-sm text-slate-300">
                  Account Role
                </p>

                <p className="mt-1 font-semibold text-blue-300">
                  {user.role}
                </p>

              </div>

              {/* Account Status */}
              <div className="rounded-xl border border-white/15 bg-black/25 p-4 backdrop-blur-sm transition hover:bg-black/35">

                <p className="text-sm text-slate-300">
                  Account Status
                </p>

                <p className="mt-1 font-semibold text-emerald-300">
                  ● Active
                </p>

              </div>

              {/* Member Since */}
              <div className="rounded-xl border border-white/15 bg-black/25 p-4 backdrop-blur-sm transition hover:bg-black/35">

                <p className="text-sm text-slate-300">
                  Member Since
                </p>

                <p className="mt-1 font-semibold">
                  {formatDate(user.createdAt)}
                </p>

              </div>

            </div>
          ) : null}

        </div>

        {/* Department Modules */}
        <div className="grid gap-6 md:grid-cols-2">

          {/* Police */}
          <Link
            href="/dashboard/police"
            className="group relative z-20 block rounded-2xl border border-blue-300/25 bg-slate-950/35 p-6 shadow-2xl backdrop-blur-md transition hover:border-blue-400/70 hover:bg-slate-950/45"
          >

            <div className="mb-4 text-3xl transition group-hover:scale-110">
              👮
            </div>

            <h2 className="text-xl font-semibold">
              Police Department
            </h2>

            <p className="mt-2 text-slate-200">
              Verify police officers using their official officer number.
            </p>

            <p className="mt-5 font-semibold text-blue-300">
              Verify Police Officer →
            </p>

          </Link>

          {/* Land */}
          <Link
            href="/dashboard/land"
            className="group relative z-20 block rounded-2xl border border-emerald-300/25 bg-slate-950/35 p-6 shadow-2xl backdrop-blur-md transition hover:border-emerald-400/70 hover:bg-slate-950/45"
          >

            <div className="mb-4 text-3xl transition group-hover:scale-110">
              🏠
            </div>

            <h2 className="text-xl font-semibold">
              Land Department
            </h2>

            <p className="mt-2 text-slate-200">
              Verify surveyors, registrars, clerks, land administration
              officers and land valuers.
            </p>

            <p className="mt-5 font-semibold text-emerald-300">
              Verify Land Professional →
            </p>

          </Link>

          {/* Judicial */}
          <Link
            href="/dashboard/judicial"
            className="group relative z-20 block rounded-2xl border border-purple-300/25 bg-slate-950/35 p-6 shadow-2xl backdrop-blur-md transition hover:border-purple-400/70 hover:bg-slate-950/45"
          >

            <div className="mb-4 text-3xl transition group-hover:scale-110">
              ⚖️
            </div>

            <h2 className="text-xl font-semibold">
              Judicial Department
            </h2>

            <p className="mt-2 text-slate-200">
              Verify judicial personnel and official judicial credentials.
            </p>

            <p className="mt-5 font-semibold text-purple-300">
              Verify Judicial Personnel →
            </p>

          </Link>

          {/* AOB */}
          <Link
            href="/dashboard/aob"
            className="group relative z-20 block rounded-2xl border border-amber-300/25 bg-slate-950/35 p-6 shadow-2xl backdrop-blur-md transition hover:border-amber-400/70 hover:bg-slate-950/45"
          >

            <div className="mb-4 text-3xl transition group-hover:scale-110">
              📢
            </div>

            <h2 className="text-xl font-semibold">
              AOB / Reports & Feedback
            </h2>

            <p className="mt-2 text-slate-200">
              Submit reports, feedback, negative feedback or other matters.
            </p>

            <p className="mt-5 font-semibold text-amber-300">
              Submit Report or Feedback →
            </p>

          </Link>

        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-sm text-slate-200 drop-shadow">
          VeryfyKe — Credential Verification System
        </div>

      </div>
    </main>
  );
}