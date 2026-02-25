"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
      rememberMe: remember,
    });

    if (response?.error) {
      toast.error("Invalid email or password");
      setIsLoading(false);
      return;
    }

    toast.success("Welcome back");
    router.replace("/dashboard");
  };

  return (
    <AuthShell title="Welcome" subtitle="Sign in to continue your beauty journey">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            placeholder="you@gmail.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="********"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#95a2b0]"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-[#4e5e70]">
            <Checkbox checked={remember} onCheckedChange={(checked) => setRemember(Boolean(checked))} />
            Remember me
          </label>
          <Link href="/forgot-password" className="text-sm font-semibold text-[#168bd3]">
            Forgot password?
          </Link>
        </div>

        <Button className="h-12 w-full text-xl text-base" type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Log In"}
        </Button>

        <p className="text-center text-base text-[#415164]">
          Create a new account. <span className="font-semibold text-[#168bd3]">Sign In</span>
        </p>
      </form>
    </AuthShell>
  );
}
