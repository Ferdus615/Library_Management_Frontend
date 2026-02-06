import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-center justify-center px-4 text-center sm:px-8">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl md:text-6xl">
            Welcome to <span className="text-blue-600">Library Management</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
            Efficiently manage your library resources, track books, and manage
            members with ease. The all-in-one solution for modern libraries.
          </p>
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link href="/register">
              <Button className="min-w-[200px] text-lg">Sign Up</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
