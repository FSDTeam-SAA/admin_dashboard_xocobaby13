"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPasswordApi, getApiErrorMessage } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const forgotMutation = useMutation({
    mutationFn: forgotPasswordApi,
    onSuccess: () => {
      toast.success("OTP sent to your email");
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });

  return (
    <AuthShell title="Forgot Password" subtitle="Enter your email to recover your password">
      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          forgotMutation.mutate({ email });
        }}
      >
        <div className="relative">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="pl-11"
            required
          />
          <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7e8b99]" />
        </div>
        <Button className="h-12 w-full text-xl text-base" type="submit" disabled={forgotMutation.isPending}>
          {forgotMutation.isPending ? "Sending..." : "Send OTP"}
        </Button>
      </form>
    </AuthShell>
  );
}
