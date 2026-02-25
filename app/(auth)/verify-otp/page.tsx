"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { forgotPasswordApi, getApiErrorMessage, verifyOtpApi } from "@/lib/api";
import { toast } from "sonner";

const OTP_LENGTH = 6;

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = useMemo(() => searchParams.get("email") || "", [searchParams]);

  const [otpDigits, setOtpDigits] = useState<string[]>(Array.from({ length: OTP_LENGTH }, () => ""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!email) router.replace("/forgot-password");
  }, [email, router]);

  const verifyMutation = useMutation({
    mutationFn: verifyOtpApi,
    onSuccess: () => {
      const otp = otpDigits.join("");
      toast.success("OTP verified");
      router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${otp}`);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const resendMutation = useMutation({
    mutationFn: forgotPasswordApi,
    onSuccess: () => toast.success("OTP resent"),
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const handleChange = (index: number, value: string) => {
    const next = value.replace(/\D/g, "").slice(-1);
    const updated = [...otpDigits];
    updated[index] = next;
    setOtpDigits(updated);

    if (next && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const otp = otpDigits.join("");
    if (otp.length !== OTP_LENGTH) {
      toast.error("Please enter the full OTP");
      return;
    }
    verifyMutation.mutate({ email, otp });
  };

  return (
    <AuthShell title="Verify Email" subtitle="Enter the OTP to verify your email">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="flex items-center justify-between gap-3">
          {otpDigits.map((digit, index) => (
            <input
              key={index}
              ref={(node) => {
                inputRefs.current[index] = node;
              }}
              value={digit}
              onChange={(event) => handleChange(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              inputMode="numeric"
              maxLength={1}
              className="h-16 w-14 rounded-md border border-[#8d9baa] bg-white text-center text-2xl font-semibold text-[#1f2f43] outline-none focus:border-[#168bd3] focus:ring-2 focus:ring-[#168bd3]/20"
            />
          ))}
        </div>
        <p className="text-right text-lg text-[#334155]">
          Don&apos;t get a code?{" "}
          <button
            type="button"
            className="font-semibold text-[#168bd3]"
            onClick={() => resendMutation.mutate({ email })}
            disabled={resendMutation.isPending}
          >
            Resend
          </button>
        </p>
        <Button className="h-12 w-full text-xl text-base" type="submit" disabled={verifyMutation.isPending}>
          {verifyMutation.isPending ? "Verifying..." : "Verify"}
        </Button>
      </form>
    </AuthShell>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <AuthShell title="Verify Email" subtitle="Enter the OTP to verify your email">
          <div className="h-[250px]" />
        </AuthShell>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}
