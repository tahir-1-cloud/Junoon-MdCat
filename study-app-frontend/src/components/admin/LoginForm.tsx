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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (username === 'admin' && password === '12345') {
        router.replace('/admin/dashboard');
        return;
      }

      const result = await loginStudent({
        userName: username,
        password: password
      });

      router.replace('/student/dashboard');

    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data || err.message || 'Login failed';
        alert(typeof message === 'string' ? message : 'Login failed');
      } else {
        alert('An unexpected error occurred');
      }
    }
  };

return (
  <div className="flex flex-col flex-1 lg:w-1/2 w-full bg-gradient-to-br from-blue-100 to-blue-200">
    <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">

      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 to-blue-500 text-transparent bg-clip-text">
          JUNOON MDCAT Login
        </h1>

        <p className="mt-2 text-sm font-medium text-gray-800">
          Login to continue your MDCAT preparation.
        </p>
      </div>

      {/* Card Layout */}
      <div className="bg-white/70 backdrop-blur border border-gray-200 shadow-md rounded-xl p-8">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">

            {/* Email */}
            <div>
              <Label>Email <span className="text-red-500">*</span></Label>
              <Input
                placeholder="yourname@example.com"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Password */}
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
                  className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeIcon className="w-5" /> : <EyeSlashIcon className="w-5" />}
                </span>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox checked={isChecked} onChange={setIsChecked} />
                <span className="text-sm text-gray-800">Keep me logged in</span>
              </div>

              <Link
                href="/reset-password"
                className="text-sm text-blue-700 hover:text-blue-800"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <div>
              <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2.5 rounded-lg shadow">
                Sign In
              </Button>
            </div>

          </div>
        </form>
      </div>

    </div>
  </div>
);


}
