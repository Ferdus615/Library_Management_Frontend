"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { authService } from "../../../services/auth.service";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const userData = await authService.login(formData);

      // Successful login - Redirect based on role
      const userRole = userData?.user?.role;
      if (userRole === "admin" || userRole === "librarian") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Layer 0: Background Colors */}
      <div className="absolute inset-0 flex flex-col lg:flex-row pointer-events-none z-0">
        <div className="hidden lg:block lg:w-1/2 bg-(--clr-surface-a0)" />
        <div className="w-full lg:w-1/2 bg-(--clr-light-a0) dark:bg-(--clr-surface-a0)" />
      </div>

      {/* Layer 1: Grid & Glow */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {/* Subtle Grid Background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(128,128,128,0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(128,128,128,0.08) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
        {/* Radial glow effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center, (--clr-primary-a0)_0%,_transparent_70%)] opacity-20" />
      </div>

      {/* Layer 2: Content */}
      <div className="relative z-20 flex flex-col justify-center lg:flex-row min-h-screen">
        {/* Branding Section (Left Side Content) */}
        <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12">
          <div className="flex flex-col items-center gap-8 text-center">
            <div className="flex items-center gap-4">
              <Image
                src="/brand/logo-icon-w.svg"
                alt="Library Management System"
                width={80}
                height={80}
                priority
              />
              <span className="text-4xl leading-none font-extralight text-(--clr-light-a0) text-left">
                book
                <br />
                keeper
              </span>
            </div>

            <div className="space-y-4 max-w-md">
              <h1 className="text-3xl font-bold tracking-tight text-(--clr-light-a0)">
                Your Library.{" "}
                <span className="text-(--clr-primary-a10)">Digitalized.</span>
              </h1>
              <p className="text-lg text-(--clr-surface-a50)">
                Log in to manage your collection and stay updated with your
                library&apos;s activity.
              </p>
            </div>
          </div>
        </div>

        {/* Form Section (Right Side Content) */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8  md:p-12">
          {/* Mobile Header (Visible only on small screens) */}
          <header className="lg:hidden absolute left-0 top-0 z-20 w-full px-6 py-6 flex items-center gap-3">
            <Image
              src="/brand/logo-icon.svg"
              alt="Library Management System"
              width={30}
              height={30}
              className="dark:hidden block"
            />
            <Image
              src="/brand/logo-icon-w.svg"
              alt="Library Management System"
              width={30}
              height={30}
              className="hidden dark:block"
            />
            <span className="text-lg leading-4 font-extralight text-(--clr-dark-a0) dark:text-(--clr-light-a0)">
              book
              <br />
              keeper
            </span>
          </header>

          <div className="max-w-md w-full space-y-5 relative z-10">
            <div className="text-center">
              <h2 className="text-xl font-extrabold text-(--clr-dark-a0) dark:text-(--clr-light-a0) tracking-tight">
                Welcome Back
              </h2>
              <p className="mt-2 text-sm text-(--clr-surface-a50)">
                Log in to your account to continue
              </p>
            </div>

            <div className="bg-white/80 dark:bg-(--clr-surface-tonal-a10)/80 backdrop-blur-lg py-8 px-4 shadow-2xl rounded-2xl sm:px-10 border border-(--clr-surface-a20)/20">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-(--clr-danger-a0)/10 border border-(--clr-danger-a0)/20 text-(--clr-danger-a10) text-sm rounded-md p-3 animate-pulse">
                    {error}
                  </div>
                )}

                <Input
                  label="Email address"
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@example.com"
                />

                <Input
                  label="Password"
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                />

                <div className="flex items-center justify-end">
                  <div className="text-sm">
                    <Link
                      href="/forgot-password"
                      className="font-medium text-(--clr-primary-a0) hover:text-(--clr-primary-a10)"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    className="w-full text-lg font-semibold py-6 bg-(--clr-primary-a0) hover:bg-(--clr-primary-a10) text-white shadow-lg shadow-(--clr-primary-a0)/20"
                    isLoading={isLoading}
                  >
                    Sign in
                  </Button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-(--clr-surface-a20)" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-(--clr-surface-tonal-a10) text-(--clr-surface-a50)">
                      Don&apos;t have an account?
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <Link
                    href="/register"
                    className="font-medium text-(--clr-primary-a30) hover:text-(--clr-primary-a40) transition-colors duration-200"
                  >
                    Sign up instead
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
