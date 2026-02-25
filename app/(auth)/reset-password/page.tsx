"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Lock } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage, resetPasswordApi } from "@/lib/api";
import { toast } from "sonner";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = useMemo(() => searchParams.get("email") || "", [searchParams]);
  const otp = useMemo(() => searchParams.get("otp") || "", [searchParams]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetMutation = useMutation({
    mutationFn: resetPasswordApi,
    onSuccess: () => {
      toast.success("Password changed successfully");
      router.replace("/login");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !otp) {
      toast.error("Invalid reset link");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    resetMutation.mutate({
      email,
      otp,
      password,
      confirmPassword,
    });
  };

  return (
    <AuthShell title="Reset Password" subtitle="Create a new password">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Create New Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="pl-11 pr-11"
            required
          />
          <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7e8b99]" />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7e8b99]"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="pl-11 pr-11"
            required
          />
          <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7e8b99]" />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7e8b99]"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        <Button className="h-12 w-full text-xl text-base" type="submit" disabled={resetMutation.isPending}>
          {resetMutation.isPending ? "Changing..." : "Change Password"}
        </Button>
      </form>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <AuthShell title="Reset Password" subtitle="Create a new password">
          <div className="h-[300px]" />
        </AuthShell>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
