import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-(--clr-surface-a0)">
      {/* Subtle Grid Background */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Radial glow effect */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center, (--clr-primary-a0)_0%,_transparent_70%)] opacity-20" />

      {/* Header with Logo */}
      <header className="absolute left-0 top-0 z-20 w-full px-6 py-6 sm:px-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/brand/logo-icon-w.svg"
            alt="Library Management System"
            width={35}
            height={35}
            priority
          />

          <span className="text-xl/4 font-extralight text-(--clr-light-a0)">
            book
            <br />
            keeper
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg bg-(--clr-primary-a0) px-5 py-2 font-semibold text-(--clr-light-a0) 
            text-sm shadow-lg shadow-(--clr-primary-a0)/30 transition-all hover:scale-105 hover:bg-(--clr-primary-a10) hover:shadow-xl"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-lg border border-(--clr-surface-a30) bg-transparent px-5 py-2 font-semibold 
              text-sm text-(--clr-light-a0) transition-all hover:scale-105 hover:border-(--clr-primary-a10) hover:text-(--clr-primary-a10)"
          >
            Register
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-16 px-6 py-24 text-center">
        {/* Hero Section */}
        <section className="flex flex-col items-center gap-6">
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-(--clr-light-a0) sm:text-5xl md:text-6xl">
            Your Library.{" "}
            <span className="text-(--clr-primary-a10)">Smarter.</span>{" "}
            <span className="text-(--clr-primary-a20)">Faster.</span>{" "}
            <span className="text-(--clr-primary-a30)">Digital.</span>
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-(--clr-surface-a50)">
            Manage books, reservations, members, and notifications — all in one
            intelligent system.
          </p>
          {/* CTA Buttons */}
          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-xl bg-(--clr-primary-a0) px-8 py-3 font-semibold text-white shadow-lg 
              shadow-(--clr-primary-a0)/30 transition-all hover:scale-105 hover:bg-(--clr-primary-a10) hover:shadow-xl"
            >
              Get Started
            </Link>
            <Link
              href="#demo"
              className="inline-flex items-center justify-center rounded-xl border border-(--clr-surface-a30) bg-transparent px-8 py-3 font-semibold 
              text-(--clr-light-a0) transition-all hover:scale-105 hover:border-(--clr-primary-a10) hover:text-(--clr-primary-a10)"
            >
              View Demo
            </Link>
          </div>
        </section>

        {/* Dashboard Preview Card */}
        <section className="w-full max-w-4xl">
          <div className="rounded-2xl border border-(--clr-surface-a20) bg-(--clr-surface-tonal-a0) p-6 shadow-2xl shadow-black/50">
            {/* Card Header */}
            <div className="mb-6 flex items-center justify-between border-b border-(--clr-surface-a20) pb-4">
              <h2 className="text-lg font-semibold text-(--clr-light-a0)">
                Dashboard Overview
              </h2>
              <div className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-(--clr-danger-a0)" />
                <span className="h-3 w-3 rounded-full bg-(--clr-warning-a0)" />
                <span className="h-3 w-3 rounded-full bg-(--clr-success-a0)" />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Books Card */}
              <div className="rounded-xl bg-(--clr-surface-a10) p-5 transition-transform hover:scale-[1.02]">
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-(--clr-info-a0)/20 text-(--clr-info-a10)">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-(--clr-surface-a50)">
                    Total Books
                  </span>
                </div>
                <p className="text-3xl font-bold text-(--clr-light-a0)">
                  12,847
                </p>
              </div>

              {/* Reservations Card */}
              <div className="rounded-xl bg-(--clr-surface-a10) p-5 transition-transform hover:scale-[1.02]">
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-(--clr-warning-a0)/20 text-(--clr-warning-a10)">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-(--clr-surface-a50)">
                    Reservations
                  </span>
                </div>
                <p className="text-3xl font-bold text-(--clr-light-a0)">284</p>
              </div>

              {/* Notifications Card */}
              <div className="rounded-xl bg-(--clr-surface-a10) p-5 transition-transform hover:scale-[1.02]">
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-(--clr-success-a0)/20 text-(--clr-success-a10)">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-(--clr-surface-a50)">
                    Notifications
                  </span>
                </div>
                <p className="text-3xl font-bold text-(--clr-light-a0)">18</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
