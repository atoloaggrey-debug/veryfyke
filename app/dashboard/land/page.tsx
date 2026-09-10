"use client";

import { useState } from "react";
import Link from "next/link";

type Professional = {
  registrationNo: string;
  name: string;
  profession: string;
  organization?: string | null;
  status: string;
};

const professionLabels: Record<string, string> = {
  SURVEYOR: "Surveyor",
  LAND_VALUER: "Land Valuer",
  REGISTRAR: "Land Registrar",
  CLERK: "Land Clerk",
  LAND_ADMINISTRATION_OFFICER: "Land Administration Officer",
};

export default function LandVerificationPage() {
  const [registrationNo, setRegistrationNo] = useState("");
  const [professional, setProfessional] =
    useState<Professional | null>(null);

  const [verified, setVerified] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function verifyProfessional() {
    if (!registrationNo.trim()) {
      setMessage("Please enter a registration number.");
      setProfessional(null);
      setVerified(null);
      return;
    }

    setLoading(true);
    setProfessional(null);
    setVerified(null);
    setMessage("");

    try {
      const response = await fetch("/api/verify/land", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registrationNo,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage(data.message || "Verification failed.");
        setVerified(false);
        return;
      }

      setVerified(data.verified);

      if (data.verified && data.professional) {
        setProfessional(data.professional);
        setMessage(
          "Land professional credentials verified successfully."
        );
      } else {
        setMessage(
          data.message ||
            "Land professional credentials could not be verified."
        );
      }
    } catch (error) {
      console.error(error);

      setMessage(
        "Unable to connect to the verification service."
      );

      setVerified(false);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Enter") {
      verifyProfessional();
    }
  }

  function formatProfession(profession: string) {
    return (
      professionLabels[profession] ||
      profession.replaceAll("_", " ")
    );
  }

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-fixed px-6 py-10 text-white"
      style={{ backgroundImage: "url('/land.jpg')" }}
    >
      {/* Background Overlay */}
      {/* Visual only - cannot block clicks */}
      <div className="pointer-events-none fixed inset-0 bg-slate-950/35" />

      {/* Page Content */}
      <div className="relative z-10 mx-auto max-w-5xl">

        {/* Back */}
        <Link
          href="/dashboard"
          className="relative z-20 text-sm font-medium text-emerald-200 transition hover:text-white"
        >
          ← Back to Dashboard
        </Link>

        {/* Main Glass Card */}
        <div className="relative z-10 mt-6 overflow-hidden rounded-2xl border border-emerald-300/25 bg-slate-950/30 shadow-2xl backdrop-blur-md">

          {/* Header */}
          <div className="border-b border-white/10 bg-emerald-950/20 p-8 backdrop-blur-sm">

            <div className="mb-4 inline-flex rounded-full border border-emerald-300/25 bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-200 backdrop-blur-sm">
              🏞️ Land Department
            </div>

            <h1 className="text-3xl font-bold tracking-tight drop-shadow-lg md:text-4xl">
              Land Professional Verification
            </h1>

            <p className="mt-3 max-w-2xl text-slate-200 drop-shadow">
              Verify the credentials of land professionals
              before engaging their services.
            </p>

          </div>

          {/* Main Content */}
          <div className="p-8">

            {/* Search */}
            <div className="relative z-20 rounded-xl border border-white/15 bg-black/20 p-6 shadow-lg backdrop-blur-md">

              <label
                htmlFor="registrationNo"
                className="mb-2 block text-sm font-semibold text-slate-100"
              >
                Registration Number
              </label>

              <div className="relative z-20 flex flex-col gap-3 md:flex-row">

                <input
                  id="registrationNo"
                  type="text"
                  value={registrationNo}
                  onChange={(e) =>
                    setRegistrationNo(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="Enter registration number"
                  className="relative z-20 flex-1 rounded-lg border border-white/20 bg-slate-950/45 px-4 py-3 text-white outline-none backdrop-blur-sm transition placeholder:text-slate-400 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-400/30"
                />

                <button
                  type="button"
                  onClick={verifyProfessional}
                  disabled={loading}
                  className="relative z-20 rounded-lg border border-emerald-300/20 bg-emerald-600/80 px-8 py-3 font-semibold shadow-lg backdrop-blur-sm transition hover:bg-emerald-500/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Verifying..."
                    : "Verify Professional"}
                </button>

              </div>

            </div>

            {/* Supported Professionals */}
            <div className="mt-8">

              <h2 className="mb-4 text-lg font-semibold drop-shadow">
                Supported Land Professionals
              </h2>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">

                <div className="rounded-lg border border-white/15 bg-black/20 p-4 text-center shadow-lg backdrop-blur-md transition hover:bg-black/30">
                  <div className="text-2xl">📐</div>
                  <p className="mt-2 text-sm font-medium">
                    Surveyor
                  </p>
                </div>

                <div className="rounded-lg border border-white/15 bg-black/20 p-4 text-center shadow-lg backdrop-blur-md transition hover:bg-black/30">
                  <div className="text-2xl">📊</div>
                  <p className="mt-2 text-sm font-medium">
                    Land Valuer
                  </p>
                </div>

                <div className="rounded-lg border border-white/15 bg-black/20 p-4 text-center shadow-lg backdrop-blur-md transition hover:bg-black/30">
                  <div className="text-2xl">📋</div>
                  <p className="mt-2 text-sm font-medium">
                    Registrar
                  </p>
                </div>

                <div className="rounded-lg border border-white/15 bg-black/20 p-4 text-center shadow-lg backdrop-blur-md transition hover:bg-black/30">
                  <div className="text-2xl">🗂️</div>
                  <p className="mt-2 text-sm font-medium">
                    Clerk
                  </p>
                </div>

                <div className="rounded-lg border border-white/15 bg-black/20 p-4 text-center shadow-lg backdrop-blur-md transition hover:bg-black/30">
                  <div className="text-2xl">🏛️</div>
                  <p className="mt-2 text-sm font-medium">
                    Land Administration
                  </p>
                </div>

              </div>
            </div>

            {/* Verification Message */}
            {message && (
              <div
                className={`relative z-20 mt-8 rounded-xl border p-6 shadow-lg backdrop-blur-md ${
                  verified
                    ? "border-emerald-400/40 bg-emerald-950/30"
                    : "border-red-400/40 bg-red-950/30"
                }`}
              >

                <div className="flex items-start gap-4">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/25 text-2xl backdrop-blur-sm">
                    {verified ? "✓" : "!"}
                  </div>

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

                    <p className="mt-2 text-sm text-slate-200">
                      {message}
                    </p>

                  </div>

                </div>

              </div>
            )}

            {/* Professional Details */}
            {professional && verified && (
              <div className="relative z-20 mt-6 overflow-hidden rounded-xl border border-white/15 bg-slate-950/30 shadow-xl backdrop-blur-md">

                <div className="border-b border-white/10 bg-slate-900/25 px-6 py-4 backdrop-blur-sm">
                  <h2 className="font-semibold">
                    Verified Professional Details
                  </h2>
                </div>

                <div className="grid gap-4 p-6 sm:grid-cols-2">

                  <div className="rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-wide text-slate-300">
                      Full Name
                    </p>

                    <p className="mt-1 text-lg font-semibold drop-shadow">
                      {professional.name}
                    </p>
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-wide text-slate-300">
                      Profession
                    </p>

                    <p className="mt-1 text-lg font-semibold text-emerald-300">
                      {formatProfession(
                        professional.profession
                      )}
                    </p>
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-wide text-slate-300">
                      Registration Number
                    </p>

                    <p className="mt-1 font-semibold drop-shadow">
                      {professional.registrationNo}
                    </p>
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-wide text-slate-300">
                      Organization
                    </p>

                    <p className="mt-1 font-semibold drop-shadow">
                      {professional.organization ||
                        "Not available"}
                    </p>
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-wide text-slate-300">
                      Credential Status
                    </p>

                    <p className="mt-1 font-semibold text-emerald-300">
                      {professional.status}
                    </p>
                  </div>

                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="mt-8 rounded-xl border border-amber-400/25 bg-amber-950/25 p-5 shadow-lg backdrop-blur-md">

              <p className="text-sm leading-6 text-amber-200">
                <strong>Security Notice:</strong>{" "}
                VeryfyKe displays only information necessary
                for credential verification. Sensitive personal
                or operational information should not be exposed
                through the public verification interface.
              </p>

            </div>

            {/* Navigation */}
            <div className="relative z-20 mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">

              <Link
                href="/dashboard"
                className="relative z-20 text-sm text-slate-200 transition hover:text-white"
              >
                ← Return to Dashboard
              </Link>

              <Link
                href="/dashboard/aob"
                className="relative z-20 text-sm text-slate-200 transition hover:text-emerald-300"
              >
                Report a verification problem →
              </Link>

            </div>

          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-300">
          VeryfyKe • Credential Verification Platform
        </p>

      </div>
    </main>
  );
}