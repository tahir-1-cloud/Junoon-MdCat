"use client";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import { loginStudent } from "@/services/userService";
import axios from "axios";

export default function LoginInForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (username === "admin" && password === "12345") {
        router.replace("/admin/dashboard");
        return;
      }

      await loginStudent({ userName: username, password });
      router.replace("/student/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data || err.message || "Login failed";
        alert(typeof message === "string" ? message : "Login failed");
      } else {
        alert("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center relative z-10">
      <div className="w-full max-w-md px-8">
        {/* Header */}
     <div className="mb-10 text-center">
        {/* <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 drop-shadow-sm">
          JUNOON MDCAT Login
        </h1> */}
        {/* <h4 className="text-lg lg:text-3xl text-gray-900 font-semibold">
          Login to continue your MDCAT preparation
        </h4> */}
      </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Email <span className="text-red-500">*</span></Label>
              <Input
                placeholder="Enter your email"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <Label>Password <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                >
                  {showPassword ? <EyeIcon className="w-5" /> : <EyeSlashIcon className="w-5" />}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox checked={isChecked} onChange={setIsChecked} />
                <span className="text-sm text-gray-800">Keep me logged in</span>
              </div>
              <Link href="/reset-password" className="text-sm text-blue-700 hover:text-blue-800">
                Forgot Password?
              </Link>
            </div>

            <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 rounded-xl shadow-lg">
              Login
            </Button>

          </form>
        </div>
      </div>
    </div>
  );
}
