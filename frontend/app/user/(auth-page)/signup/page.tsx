"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
// import { Checkbox } from '@/components/ui/checkbox'
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
// import Logo from '../../../../public/cn-sm-logo.svg?react';
export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  // const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validation = () => {
    const newError = {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    let isValidate = true;

    if (!formData.fullName) {
      newError.fullName = "Name is Required";
      isValidate = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newError.email = "Email is Required";
      isValidate = false;
    } else if (!emailRegex.test(formData.email)) {
      newError.email = "Enter Valid Email id";
      isValidate = false;
    }

    if (!formData.password) {
      newError.password = "Password is Required";
      isValidate = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newError.confirmPassword = "Password Must Be Same";
      isValidate = false;
    }
    setError(newError);
    return isValidate;
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation()) return;
    setIsLoading(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background flex items-center justify-center px-4 py-8">
      {/* Decorative Blobs */}
      <div className="absolute top-1/4 -left-10 w-72 h-72 bg-primary/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-1/4 -right-10 w-72 h-72 bg-accent/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Branding */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-3 mb-6">
            <div className="relative w-10 h-10">
              <Image
                src="/cn-sm-logo.svg"
                alt="Code Navigator Logo"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <span className="text-xl font-bold text-foreground">
              CodeNavigator
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Create Account
          </h1>
          <p className="text-muted-foreground text-center">
            Join developers visualizing code smarter
          </p>
        </div>

        {/* Signup Card */}
        <Card className="border border-border/50 backdrop-blur-md bg-card/80 p-8 shadow-2xl shadow-black/40">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Input */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Full Name
              </label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                className="bg-secondary/30 border-border/50 text-foreground placeholder:text-muted-foreground"
              />
              {error && <p style={{ color: "red" }}>{error.fullName}</p>}
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="bg-secondary/30 border-border/50 text-foreground placeholder:text-muted-foreground"
              />
              {error && <p style={{ color: "red" }}>{error.email}</p>}
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-secondary/30 border-border/50 text-foreground placeholder:text-muted-foreground pr-10"
                />
                {error && <p style={{ color: "red" }}>{error.password}</p>}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="bg-secondary/30 border-border/50 text-foreground placeholder:text-muted-foreground pr-10"
                />
                {error && (
                  <p style={{ color: "red" }}>{error.confirmPassword}</p>
                )}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            {/* <div className="flex items-start gap-3 mt-5">
              <Checkbox
                id="terms"
                checked={agreeToTerms}
                onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                className="mt-1"
              />
              <label htmlFor="terms" className="text-xs text-muted-foreground cursor-pointer">
                I agree to the{' '}
                <Link href="#" className="text-primary hover:text-primary/80 transition">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="#" className="text-primary hover:text-primary/80 transition">
                  Privacy Policy
                </Link>
              </label>
            </div> */}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/80 font-semibold py-2 h-auto mt-6 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card/50 text-muted-foreground">
                Or sign up with
              </span>
            </div>
          </div>

          {/* Social Signup */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="border-border/50 hover:bg-secondary/20 text-foreground"
            >
              GitHub
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-border/50 hover:bg-secondary/20 text-foreground"
            >
              Google
            </Button>
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link
              href="/user/login"
              className="text-primary hover:text-primary/80 font-medium transition"
            >
              Sign in here
            </Link>
          </p>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
