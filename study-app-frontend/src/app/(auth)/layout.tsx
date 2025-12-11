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
    <div className="lg:w-1/2 w-full hidden lg:flex flex-col items-center justify-start pt-35 z-3.7 relative px-12">

      {/* Logo */}
      <div className="mb-10">
        <Link href="/public">
          <Image
            src="/images/logo/mdlogohome.png"
            alt="Logo"
            width={200}
            height={30}
            className="drop-shadow-lg"
          />
        </Link>
      </div>

      {/* Headline Text */}
      <div className="text-center max-w-lg mx-auto">
        <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-lg leading-tight">
          Best Preparation From The Comfort
          Of Your Home
        </h3>

        <p className="text-white/90 text-lg drop-shadow-sm leading-normal">
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
