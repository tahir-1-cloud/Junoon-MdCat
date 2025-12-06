import GridShape from "@/components/common/GridShape";
import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="flex w-full h-screen relative">
        {/* Shared Background for both sides */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url('/images/Landingpage/bglogin.png')" }}
        />

        {/* Left side - Login form */}
        <div className="lg:w-1/2 w-full z-10 flex items-center justify-center">
          {children}
        </div>

        {/* Right side - Text + Vector */}
        <div className="lg:w-1/2 w-full hidden lg:flex flex-col items-center justify-center z-10 relative px-12">
          {/* Optional vector image */}
          {/* <div className="absolute top-20 left-20 w-48 h-48">
            <Image src="/images/Landingpage/loginvector.jpeg" alt="Vector" width={200} height={200} />
          </div> */}

          {/* Logo */}
          <div className="mb-6">
            <Link href="/public">
              <Image
                src="/images/logo/auth-logo.svg"
                alt="Logo"
                width={231}
                height={48}
                className="drop-shadow-lg"
              />
            </Link>
          </div>

          {/* Headline Text */}
          <div className="text-center max-w-xs">
            <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Best Preparation From The Comfort Of Your Home
            </h2>
            <p className="text-white/90 text-lg drop-shadow-sm">
              Prepare for your exams anytime, anywhere with JUNOON MDCAT online platform.
            </p>
          </div>

          {/* Decorative Grid */}
          <div className="absolute inset-0 z-0">
            <GridShape />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
