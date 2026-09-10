"use client";

import { useState } from "react";
import Link from "next/link";

type Officer = {
  name: string;
  rank: string;
  status: string;
};

export default function PoliceVerificationPage() {
  const [officerNo, setOfficerNo] = useState("");
  const [officer, setOfficer] = useState<Officer | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState<boolean | null>(null);

  async function verifyOfficer() {
    if (!officerNo.trim()) {
      setMessage("Please enter an officer number.");
      setOfficer(null);
      setVerified(null);
      return;
    }

    setLoading(true);
    setOfficer(null);
    setMessage("");
    setVerified(null);

    try {
      const response = await fetch("/api/verify/police", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          officerNo,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage(data.message || "Verification failed.");
        setVerified(false);
        return;
      }

      setVerified(data.verified);

      if (data.verified && data.officer) {
        setOfficer(data.officer);
        setMessage("Officer credentials verified successfully.");
      } else {
        setMessage(
          data.message || "Officer credentials could not be verified."
        );
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to the verification service.");
      setVerified(false);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      verifyOfficer();
    }
  }

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-fixed px-6 py-10 text-white"
      style={{ backgroundImage: "url('/police.jpg')" }}
    >
      {/* Background Overlay */}
      {/* This layer is visual only and cannot block clicks */}
      <div className="pointer-events-none fixed inset-0 bg-slate-950/40" />

      {/* Page Content */}
      <div className="relative z-10 mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8">

          {/* Back to Dashboard */}
          <Link
            href="/dashboard"
            className="relative z-20 text-sm font-medium text-blue-200 transition hover:text-white"
          >
            ← Back to Dashboard
          </Link>

          {/* Main Glass Card */}
          <div className="relative z-10 mt-6 overflow-hidden rounded-2xl border border-blue-300/30 bg-slate-950/35 p-8 shadow-2xl backdrop-blur-md">

            {/* Department Badge */}
            <div className="mb-6">

              <div className="mb-4 inline-flex rounded-full border border-blue-300/30 bg-blue-500/20 px-4 py-2 text-sm font-medium text-blue-200 backdrop-blur-sm">
                👮 Police Department
              </div>

              <h1 className="text-3xl font-bold tracking-tight drop-shadow-lg sm:text-4xl">
                Police Officer Verification
              </h1>

              <p className="mt-3 max-w-2xl text-slate-200 drop-shadow">
                Verify whether a police officer credential exists in the
                VeryfyKe verification database.
              </p>

            </div>

            {/* Search / Verification Form */}
            <div className="relative z-20 rounded-xl border border-white/15 bg-black/25 p-5 shadow-lg backdrop-blur-md">

              <label
                htmlFor="officerNo"
                className="mb-2 block text-sm font-medium text-slate-100"
              >
                Police Officer Number
              </label>

              <div className="relative z-20 flex flex-col gap-3 sm:flex-row">

                <input
                  id="officerNo"
                  type="text"
                  value={officerNo}
                  onChange={(e) => setOfficerNo(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter officer number"
                  className="relative z-20 flex-1 rounded-lg border border-white/20 bg-slate-950/55 px-4 py-3 text-white outline-none backdrop-blur-sm transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-400/30"
                />

                <button
                  type="button"
                  onClick={verifyOfficer}
                  disabled={loading}
                  className="relative z-20 rounded-lg border border-blue-300/20 bg-blue-600/80 px-7 py-3 font-semibold shadow-lg backdrop-blur-sm transition hover:bg-blue-500/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify Officer"}
                </button>

              </div>

            </div>

            {/* Verification Result */}
            {message && (
              <div
                className={`relative z-20 mt-6 rounded-xl border p-5 shadow-lg backdrop-blur-md ${
                  verified
                    ? "border-emerald-400/40 bg-emerald-950/35"
                    : "border-red-400/40 bg-red-950/35"
                }`}
              >

                <div className="flex items-center gap-3">

                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/25 text-2xl backdrop-blur-sm">
                    {verified ? "✓" : "!"}
                  </span>

                  <div>

                    <h2
                      className={`font-bold ${
                        verified
                          ? "text-emerald-300"
                          : "text-red-300"
                      }`}
                    >
                      {verified
                        ? "CREDENTIAL VERIFIED"
                        : "CREDENTIAL NOT VERIFIED"}
                    </h2>

                    <p className="mt-1 text-sm text-slate-200">
                      {message}
                    </p>

                  </div>

                </div>

              </div>
            )}

            {/* Verified Officer Details */}
            {officer && verified && (
              <div className="relative z-20 mt-6 overflow-hidden rounded-xl border border-white/15 bg-slate-950/35 shadow-xl backdrop-blur-md">

                <div className="border-b border-white/10 bg-slate-900/35 px-5 py-4 backdrop-blur-sm">
                  <h2 className="font-semibold">
                    Verified Officer Details
                  </h2>
                </div>

                <div className="grid gap-4 p-5 sm:grid-cols-2">

                  {/* Name */}
                  <div className="rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur-sm">

                    <p className="text-xs uppercase tracking-wide text-slate-300">
                      Officer Name
                    </p>

                    <p className="mt-1 text-lg font-semibold drop-shadow">
                      {officer.name}
                    </p>

                  </div>

                  {/* Rank */}
                  <div className="rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur-sm">

                    <p className="text-xs uppercase tracking-wide text-slate-300">
                      Rank
                    </p>

                    <p className="mt-1 text-lg font-semibold drop-shadow">
                      {officer.rank}
                    </p>

                  </div>

                  {/* Status */}
                  <div className="rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur-sm">

                    <p className="text-xs uppercase tracking-wide text-slate-300">
                      Status
                    </p>

                    <p className="mt-1 font-semibold text-emerald-300">
                      {officer.status}
                    </p>

                  </div>

                  {/* Officer Number */}
                  <div className="rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur-sm">

                    <p className="text-xs uppercase tracking-wide text-slate-300">
                      Officer Number
                    </p>

                    <p className="mt-1 font-semibold drop-shadow">
                      {officerNo.toUpperCase()}
                    </p>

                  </div>

                </div>

              </div>
            )}

            {/* Security Notice */}
            <div className="relative z-20 mt-6 rounded-xl border border-amber-400/30 bg-amber-950/30 p-4 shadow-lg backdrop-blur-md">

              <p className="text-sm text-amber-200">
                <strong>Security Notice:</strong> VeryfyKe does not display
                sensitive operational information such as an officer&apos;s
                station in this verification result.
              </p>

            </div>

            {/* AOB */}
            <div className="relative z-20 mt-6 text-center">

              <Link
                href="/dashboard/aob"
                className="relative z-20 text-sm text-slate-200 transition hover:text-blue-200"
              >
                Report a verification problem →
              </Link>

            </div>

          </div>
        </div>
      </div>
    </main>
  );
}