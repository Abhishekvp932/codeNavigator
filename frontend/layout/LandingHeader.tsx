import { Button } from "@/components/ui/button";
import { RootState } from "@/redux/store";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function LandingHeader() {
  const [isOpen, setIsOpen] = useState(false);
  
  
  const router = useRouter();
  const user = useSelector((state:RootState)=> state.user.user);

    useEffect(()=>{
    if(user){
      router.push('/user/home');
    }
  },[router,user]);
  const handleLoginPage = () => {
    router.push("/user/login");
  };

  const handleSignup = () => {
    router.push("/user/signup");
  };
  return (
    <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <div className="relative w-10 h-10">
                <Image
                  src="/cn-sm-logo.svg"
                  alt="Code Navigator Logo"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
            <span className="text-xl font-bold text-foreground">
              CodeNavigator
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {/* <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a> */}
            {/* <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
              <a href="#docs" className="text-muted-foreground hover:text-foreground transition-colors">
                Docs
              </a> */}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              onClick={handleLoginPage}
              variant="ghost"
              className="text-foreground hover:text-primary"
            >
              Log In
            </Button>
            <Button
              onClick={handleSignup}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-4">
            {/* <a
              href="#features"
              className="block text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="block text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </a>
            <a
              href="#docs"
              className="block text-muted-foreground hover:text-foreground transition-colors"
            >
              Docs
            </a> */}
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              <Button
                variant="ghost"
                className="w-full text-foreground hover:text-primary"
              >
                Log In
              </Button>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Sign Up
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
