"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import Image from "next/image";

const ForgotPasswordPage = () => {
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
                Enter your email address, and we&apos;ll send you a link to
                reset your password.
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
                Forgot Password
              </h2>
              <p className="mt-2 text-sm text-(--clr-surface-a50)">
                Enter your email to reset password
              </p>
            </div>

            <div className="bg-white/80 dark:bg-(--clr-surface-tonal-a10)/80 backdrop-blur-lg py-8 px-4 shadow-2xl rounded-2xl sm:px-10 border border-(--clr-surface-a20)/20">
              <form className="space-y-6">
                <Input
                  label="Email address"
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  required
                  // value={email}
                  // onChange={handleChange}
                  placeholder="john.doe@example.com"
                />

                <div>
                  <Button
                    type="submit"
                    className="w-full text-lg font-semibold py-6 bg-(--clr-primary-a0) hover:bg-(--clr-primary-a10) text-white shadow-lg shadow-(--clr-primary-a0)/20"
                    // isLoading={isLoading}
                  >
                    Reset My Password
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
                      Remember your password?
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <Link
                    href="/login"
                    className="font-medium text-(--clr-primary-a0) hover:text-(--clr-primary-a10) transition-colors duration-200"
                  >
                    Back to login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
