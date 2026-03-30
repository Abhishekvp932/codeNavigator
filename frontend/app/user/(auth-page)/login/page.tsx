"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error,setError] = useState({email:'',password:''});


  const validation = ()=>{

    const newError = {email:"",password: ""};
    let isValidate = true
    if(!email){
      newError.email = "Email is Required"
      isValidate = false
    }

    if(!password){
      newError.password = "Password is Required"
      isValidate = false
    }
    setError(newError);

    return isValidate;
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!validation()) return;
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      alert("Login functionality coming soon!");
    }, 1500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background flex items-center justify-center px-4">
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
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-center">
            Sign in to continue visualizing your code
          </p>
        </div>

        {/* Login Card */}
        <Card className="border border-border/50 backdrop-blur-md bg-card/80 p-8 shadow-2xl shadow-black/40">
          <form onSubmit={handleSubmit} className="space-y-5">
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
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary/30 border-border/50 text-foreground placeholder:text-muted-foreground"
                
              />
              {error && <p style={{color:'red'}}>{error.email}</p>}
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs text-primary hover:text-primary/80 transition"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-secondary/30 border-border/50 text-foreground placeholder:text-muted-foreground pr-10"
                  
                />
                {error && <p style={{color:'red'}}>{error.password}</p>}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/80 font-semibold py-2 h-auto shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card/50 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login */}
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

          {/* Sign Up Link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Dont have an account?{" "}
            <Link
              href="/user/signup"
              className="text-primary hover:text-primary/80 font-medium transition"
            >
              Sign up here
            </Link>
          </p>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/user/home"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
