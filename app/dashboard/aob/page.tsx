"use client";

import { useState } from "react";
import Link from "next/link";

type ReportType =
  | "REPORT"
  | "FEEDBACK"
  | "NEGATIVE_FEEDBACK";

export default function AOBPage() {
  const [reportType, setReportType] =
    useState<ReportType>("REPORT");

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const [message, setMessage] = useState("");
  const [success, setSuccess] =
    useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  async function submitReport() {
    if (!subject.trim() || !description.trim()) {
      setSuccess(false);
      setMessage(
        "Please enter both a subject and a description."
      );
      return;
    }

    setLoading(true);
    setSuccess(null);
    setMessage("");

    try {
      const response = await fetch(
        "/api/verify/aob",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject: subject.trim(),
            description: description.trim(),
            department: "AOB",
            type: reportType,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setSuccess(false);
        setMessage(
          data.message ||
            "Unable to submit your report."
        );
        return;
      }

      setSuccess(true);
      setMessage(
        data.message ||
          "Your report has been submitted successfully."
      );

      setSubject("");
      setDescription("");
      setReportType("REPORT");
    } catch (error) {
      console.error(
        "AOB submission error:",
        error
      );

      setSuccess(false);
      setMessage(
        "Unable to connect to the reporting service."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (e.key === "Enter" && e.ctrlKey) {
      submitReport();
    }
  }

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-fixed px-6 py-10 text-white"
      style={{ backgroundImage: "url('/aob.jpg')" }}
    >
      {/* Background Overlay */}
      <div className="pointer-events-none fixed inset-0 bg-slate-950/35" />

      {/* Page Content */}
      <div className="relative z-10 mx-auto max-w-5xl">

        {/* Back to Dashboard */}
        <Link
          href="/dashboard"
          className="relative z-20 text-sm font-medium text-amber-200 transition hover:text-white"
        >
          ← Back to Dashboard
        </Link>

        {/* Main Glass Card */}
        <div className="relative z-10 mt-6 overflow-hidden rounded-2xl border border-amber-300/25 bg-slate-950/30 shadow-2xl backdrop-blur-md">

          {/* Header */}
          <div className="border-b border-white/10 bg-amber-950/20 p-8 backdrop-blur-sm">

            <div className="mb-4 inline-flex rounded-full border border-amber-300/25 bg-amber-500/15 px-4 py-2 text-sm font-medium text-amber-200 backdrop-blur-sm">
              📢 AOB / Reports & Feedback
            </div>

            <h1 className="text-3xl font-bold tracking-tight drop-shadow-lg md:text-4xl">
              Reports & Feedback
            </h1>

            <p className="mt-3 max-w-2xl text-slate-200 drop-shadow">
              Report matters outside the main verification
              departments, provide feedback, or report problems
              encountered while using VeryfyKe.
            </p>

          </div>

          {/* Content */}
          <div className="p-8">

            {/* Information */}
            <div className="relative z-20 rounded-xl border border-white/15 bg-black/20 p-6 shadow-lg backdrop-blur-md">

              <h2 className="text-lg font-semibold drop-shadow">
                What can you submit?
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-3">

                <div className="rounded-lg border border-white/15 bg-black/20 p-5 shadow-lg backdrop-blur-md transition hover:bg-black/30">
                  <div className="text-3xl">
                    🚨
                  </div>

                  <h3 className="mt-3 font-semibold">
                    Report
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    Report an issue, suspicious activity, or
                    matter that requires attention.
                  </p>
                </div>

                <div className="rounded-lg border border-white/15 bg-black/20 p-5 shadow-lg backdrop-blur-md transition hover:bg-black/30">
                  <div className="text-3xl">
                    💬
                  </div>

                  <h3 className="mt-3 font-semibold">
                    Feedback
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    Tell us how VeryfyKe is working for you
                    and suggest improvements.
                  </p>
                </div>

                <div className="rounded-lg border border-white/15 bg-black/20 p-5 shadow-lg backdrop-blur-md transition hover:bg-black/30">
                  <div className="text-3xl">
                    ⚠️
                  </div>

                  <h3 className="mt-3 font-semibold">
                    Negative Feedback
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    Report something that did not work properly
                    or an experience that needs improvement.
                  </p>
                </div>

              </div>
            </div>

            {/* Report Form */}
            <div className="relative z-20 mt-8 rounded-xl border border-white/15 bg-black/20 p-6 shadow-lg backdrop-blur-md">

              <h2 className="text-xl font-semibold drop-shadow">
                Submit a Report or Feedback
              </h2>

              <p className="mt-2 text-sm text-slate-300">
                Please provide accurate information so the
                matter can be reviewed appropriately.
              </p>

              {/* Type */}
              <div className="mt-6">

                <label
                  htmlFor="reportType"
                  className="mb-2 block text-sm font-semibold text-slate-100"
                >
                  Submission Type
                </label>

                <select
                  id="reportType"
                  value={reportType}
                  onChange={(e) =>
                    setReportType(
                      e.target.value as ReportType
                    )
                  }
                  className="relative z-20 w-full rounded-lg border border-white/20 bg-slate-950/45 px-4 py-3 text-white outline-none backdrop-blur-sm transition focus:border-amber-300 focus:ring-2 focus:ring-amber-400/30"
                >
                  <option value="REPORT">
                    Report
                  </option>

                  <option value="FEEDBACK">
                    Feedback
                  </option>

                  <option value="NEGATIVE_FEEDBACK">
                    Negative Feedback
                  </option>
                </select>

              </div>

              {/* Subject */}
              <div className="mt-6">

                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-semibold text-slate-100"
                >
                  Subject
                </label>

                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) =>
                    setSubject(e.target.value)
                  }
                  placeholder="Enter the subject of your report"
                  className="relative z-20 w-full rounded-lg border border-white/20 bg-slate-950/45 px-4 py-3 text-white outline-none backdrop-blur-sm transition placeholder:text-slate-400 focus:border-amber-300 focus:ring-2 focus:ring-amber-400/30"
                />

              </div>

              {/* Description */}
              <div className="mt-6">

                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold text-slate-100"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  rows={7}
                  placeholder="Describe the matter in detail..."
                  className="relative z-20 w-full resize-none rounded-lg border border-white/20 bg-slate-950/45 px-4 py-3 text-white outline-none backdrop-blur-sm transition placeholder:text-slate-400 focus:border-amber-300 focus:ring-2 focus:ring-amber-400/30"
                />

                <p className="mt-2 text-xs text-slate-300">
                  Tip: Press Ctrl + Enter to submit.
                </p>

              </div>

              {/* Submit */}
              <div className="relative z-20 mt-6 flex justify-end">

                <button
                  type="button"
                  onClick={submitReport}
                  disabled={loading}
                  className="relative z-20 rounded-lg border border-amber-300/20 bg-amber-600/80 px-8 py-3 font-semibold shadow-lg backdrop-blur-sm transition hover:bg-amber-500/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Submitting..."
                    : "Submit Report"}
                </button>

              </div>

            </div>

            {/* Result Message */}
            {message && (
              <div
                className={`relative z-20 mt-8 rounded-xl border p-6 shadow-lg backdrop-blur-md ${
                  success
                    ? "border-emerald-400/40 bg-emerald-950/30"
                    : "border-red-400/40 bg-red-950/30"
                }`}
              >

                <div className="flex items-start gap-4">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/25 text-2xl backdrop-blur-sm">
                    {success ? "✓" : "!"}
                  </div>

                  <div>

                    <h2
                      className={`font-bold ${
                        success
                          ? "text-emerald-300"
                          : "text-red-300"
                      }`}
                    >
                      {success
                        ? "SUBMISSION SUCCESSFUL"
                        : "SUBMISSION FAILED"}
                    </h2>

                    <p className="mt-2 text-sm text-slate-200">
                      {message}
                    </p>

                  </div>

                </div>

              </div>
            )}

            {/* Security Notice */}
            <div className="relative z-20 mt-8 rounded-xl border border-amber-400/25 bg-amber-950/25 p-5 shadow-lg backdrop-blur-md">

              <p className="text-sm leading-6 text-amber-200">
                <strong>Security Notice:</strong>{" "}
                Do not submit passwords, financial information,
                private security credentials, or other highly
                sensitive personal information through this
                form. Provide only information necessary for
                reviewing the report or feedback.
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

              <div className="relative z-20 flex flex-wrap justify-center gap-5">

                <Link
                  href="/dashboard/police"
                  className="relative z-20 text-sm text-slate-200 transition hover:text-blue-300"
                >
                  Police Verification
                </Link>

                <Link
                  href="/dashboard/land"
                  className="relative z-20 text-sm text-slate-200 transition hover:text-emerald-300"
                >
                  Land Verification
                </Link>

                <Link
                  href="/dashboard/judicial"
                  className="relative z-20 text-sm text-slate-200 transition hover:text-purple-300"
                >
                  Judicial Verification
                </Link>

              </div>

            </div>

          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-300">
          VeryfyKe • Community Reporting
        </p>

      </div>
    </main>
  );
}