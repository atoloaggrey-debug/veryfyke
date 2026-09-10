import Link from "next/link";

export default function Home() {
  return (
    <main
      className="min-h-screen bg-slate-950 bg-cover bg-center bg-fixed text-white"
      style={{ backgroundImage: "url('/Nairobi.jpg')" }}
    >
      {/* Background Overlay */}
      <div className="fixed inset-0 bg-slate-950/75" />

      {/* Page Content */}
      <div className="relative z-10">

        {/* Navigation */}
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold">
              ✓
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-wide">
                VeryfyKe
              </h1>

              <p className="text-xs text-slate-300">
                Verify Before You Trust
              </p>
            </div>
          </Link>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-5 py-2 text-slate-200 transition hover:bg-slate-800/80 hover:text-white"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="rounded-lg bg-blue-600 px-5 py-2 font-semibold transition hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </div>

        </nav>

        {/* Hero Section */}
        <section className="mx-auto flex max-w-7xl flex-col items-center px-6 pb-20 pt-24 text-center">

          {/* Badge */}
          <div className="mb-6 rounded-full border border-blue-400/30 bg-blue-500/20 px-5 py-2 text-sm text-blue-200 backdrop-blur-sm">
            Kenya Credential Verification Platform
          </div>

          {/* Main Heading */}
          <h2 className="max-w-4xl text-5xl font-bold leading-tight drop-shadow-lg md:text-7xl">
            Verify Before
            <span className="text-blue-400">
              {" "}You Trust.
            </span>
          </h2>

          {/* Description */}
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 drop-shadow-md">
            VeryfyKe helps you verify authorized professional and
            public-service credentials before engaging their services.
          </p>

          {/* Hero Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/login"
              className="rounded-xl bg-blue-600 px-8 py-4 font-semibold shadow-lg shadow-blue-600/30 transition hover:bg-blue-700"
            >
              Start Verification
            </Link>

            <Link
              href="#how-it-works"
              className="rounded-xl border border-white/20 bg-slate-900/50 px-8 py-4 font-semibold text-slate-200 backdrop-blur-sm transition hover:bg-slate-800/70"
            >
              How It Works
            </Link>
          </div>

        </section>

        {/* Departments */}
        <section className="mx-auto max-w-7xl px-6 pb-24">

          <div className="mb-10 text-center">
            <h3 className="text-3xl font-bold drop-shadow-lg">
              Verification Departments
            </h3>

            <p className="mt-3 text-slate-200">
              Select a department to verify credentials.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            {/* Police */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/75 p-6 shadow-xl backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20">

              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/20 text-2xl">
                🛡️
              </div>

              <h4 className="text-xl font-bold">
                Police
              </h4>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Verify authorized police credentials and professional
                identity information.
              </p>

              <Link
                href="/login"
                className="mt-6 inline-block text-sm font-semibold text-blue-400 hover:text-blue-300"
              >
                Verify Officer →
              </Link>

            </div>

            {/* Land */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/75 p-6 shadow-xl backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-green-500 hover:shadow-lg hover:shadow-green-500/20">

              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-green-500/20 text-2xl">
                📐
              </div>

              <h4 className="text-xl font-bold">
                Land
              </h4>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Verify surveyors, registrars, clerks and authorized
                land administration professionals.
              </p>

              <Link
                href="/login"
                className="mt-6 inline-block text-sm font-semibold text-blue-400 hover:text-blue-300"
              >
                Verify Professional →
              </Link>

            </div>

            {/* Judicial */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/75 p-6 shadow-xl backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20">

              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-purple-500/20 text-2xl">
                ⚖️
              </div>

              <h4 className="text-xl font-bold">
                Judicial
              </h4>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Verify authorized judicial and court-related
                professional credentials.
              </p>

              <Link
                href="/login"
                className="mt-6 inline-block text-sm font-semibold text-blue-400 hover:text-blue-300"
              >
                Verify Credential →
              </Link>

            </div>

            {/* AOB */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/75 p-6 shadow-xl backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20">

              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500/20 text-2xl">
                💬
              </div>

              <h4 className="text-xl font-bold">
                AOB
              </h4>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Report issues, provide feedback and suggest
                improvements to the VeryfyKe platform.
              </p>

              <Link
                href="/login"
                className="mt-6 inline-block text-sm font-semibold text-blue-400 hover:text-blue-300"
              >
                Visit AOB →
              </Link>

            </div>

          </div>

        </section>

        {/* How It Works */}
        <section
          id="how-it-works"
          className="border-y border-white/10 bg-slate-950/70 px-6 py-20 backdrop-blur-sm"
        >

          <div className="mx-auto max-w-5xl text-center">

            <h3 className="text-3xl font-bold">
              How VeryfyKe Works
            </h3>

            <p className="mt-4 text-slate-300">
              A simple process designed to help you verify before
              engaging a service provider.
            </p>

            <div className="mt-12 grid gap-8 md:grid-cols-3">

              {/* Step 1 */}
              <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold">
                  1
                </div>

                <h4 className="mt-5 text-lg font-bold">
                  Create an Account
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Register for a VeryfyKe account to access the
                  verification platform.
                </p>
              </div>

              {/* Step 2 */}
              <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold">
                  2
                </div>

                <h4 className="mt-5 text-lg font-bold">
                  Select a Department
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Choose Police, Land, Judicial or AOB depending
                  on what you need.
                </p>
              </div>

              {/* Step 3 */}
              <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold">
                  3
                </div>

                <h4 className="mt-5 text-lg font-bold">
                  Verify
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Enter the authorized credential number and
                  receive the available verification result.
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-slate-950/80 px-6 py-10">

          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold">
                ✓
              </div>

              <span className="font-semibold">
                VeryfyKe
              </span>

            </div>

            <p className="text-sm text-slate-400">
              © 2026 VeryfyKe. Verify Before You Trust.
            </p>

          </div>

        </footer>

      </div>
    </main>
  );
}
