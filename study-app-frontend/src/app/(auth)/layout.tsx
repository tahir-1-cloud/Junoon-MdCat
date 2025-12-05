import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";

import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col dark:bg-gray-900 sm:p-0">

          {children}

          {/* RIGHT SIDE */}
          <div className="lg:w-1/2 w-full h-full hidden lg:flex flex-col relative bg-gradient-to-br from-blue-100 to-blue-300">

            {/* Background vector image */}
            <div
              className="absolute inset-0 bg-no-repeat bg-contain bg-center opacity-90"
              style={{
                backgroundImage: "url('/images/Landingpage/login.avif')",
              }}
            ></div>

            {/* Logo at top */}
            <div className="relative z-10 flex justify-center mt-20">
              <Link href="/public" className="block">
                <Image
                  width={231}
                  height={48}
                  src="/images/logo/auth-logo.svg"
                  alt="Logo"
                  className="drop-shadow-lg"
                />
              </Link>
            </div>

            {/* Text area full below logo */}
         

            {/* Grid Shape */}
            <div className="absolute inset-0 z-0">
              <GridShape />
            </div>

          </div>

        </div>
      </ThemeProvider>
    </div>
  );
}
