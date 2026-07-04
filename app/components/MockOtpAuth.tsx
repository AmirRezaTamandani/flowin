"use client";

import { useRef, useState } from "react";
import { CheckCircle2, ShieldCheck, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  isPhoneStepValueValid,
  normalizePhoneDigits,
  sanitizePhoneValue,
} from "../lib/phoneValidation";
import { isMockOtpValid, MOCK_OTP_CODE, useAuthStore } from "../lib/authStore";

const OTP_LENGTH = 6;

function createEmptyOtpDigits(): string[] {
  return Array.from({ length: OTP_LENGTH }, () => "");
}

export default function MockOtpAuth() {
  const login = useAuthStore((state) => state.login);
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(createEmptyOtpDigits);
  const [error, setError] = useState("");
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const normalizedPhone = normalizePhoneDigits(phone);
  const otpValue = otpDigits.join("");

  function focusOtp(index: number) {
    otpRefs.current[index]?.focus();
    otpRefs.current[index]?.select();
  }

  function handleSendCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isPhoneStepValueValid(normalizedPhone)) {
      setError("شماره موبایل معتبر وارد کنید.");
      return;
    }
    setError("");
    setStep("otp");
    setOtpDigits(createEmptyOtpDigits());
    setTimeout(() => focusOtp(0), 0);
  }

  function updateOtpDigit(index: number, rawValue: string) {
    const digit = rawValue.replace(/\D/g, "").slice(-1);
    setOtpDigits((current) => {
      const next = [...current];
      next[index] = digit;
      return next;
    });
    if (digit && index < OTP_LENGTH - 1) {
      setTimeout(() => focusOtp(index + 1), 0);
    }
  }

  function handleOtpKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) {
    if (event.key === "Backspace" && !otpDigits[index] && index > 0) {
      setTimeout(() => focusOtp(index - 1), 0);
    }
    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusOtp(index - 1);
    }
    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      event.preventDefault();
      focusOtp(index + 1);
    }
  }

  function handleOtpPaste(event: React.ClipboardEvent<HTMLDivElement>) {
    const pastedDigits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH)
      .split("");
    if (!pastedDigits.length) return;
    event.preventDefault();
    setOtpDigits((current) => {
      const next = [...current];
      pastedDigits.forEach((digit, index) => {
        next[index] = digit;
      });
      return next;
    });
    const lastIndex = Math.min(pastedDigits.length, OTP_LENGTH) - 1;
    setTimeout(() => focusOtp(Math.max(lastIndex, 0)), 0);
  }

  function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (otpValue.length !== OTP_LENGTH) {
      setError("کد تایید ۶ رقمی را کامل وارد کنید.");
      return;
    }
    if (!isMockOtpValid(otpValue)) {
      setError("کد وارد شده صحیح نیست. از کد تست استفاده کنید.");
      return;
    }
    setError("");
    login(normalizedPhone);
  }

  function handleBackToPhone() {
    setError("");
    setStep("phone");
    setOtpDigits(createEmptyOtpDigits());
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ShieldCheck className="size-6" />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-foreground">ورود با شماره موبایل</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            فعلاً احراز هویت به‌صورت آزمایشی با OTP موقتی انجام می‌شود.
          </p>
        </div>
      </div>

      {step === "phone" ? (
        <form className="space-y-5" onSubmit={handleSendCode}>
          <div className="space-y-2">
            <Label htmlFor="mock-auth-phone">شماره موبایل</Label>
            <Input
              id="mock-auth-phone"
              type="tel"
              dir="ltr"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="09123456789"
              value={phone}
              onChange={(event) => {
                setPhone(sanitizePhoneValue(event.target.value));
                setError("");
              }}
              aria-invalid={Boolean(error)}
              className="h-11 text-base"
            />
            <p className="text-xs text-muted-foreground">
              فقط شماره‌های موبایل ایران با فرمت <span dir="ltr">09xxxxxxxxx</span> پذیرفته می‌شود.
            </p>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button type="submit" className="h-11 w-full text-sm font-semibold">
            <Smartphone className="size-4" />
            ارسال کد تایید
          </Button>
        </form>
      ) : (
        <form className="space-y-5" onSubmit={handleVerify}>
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-medium text-foreground">
              کد تایید برای <span dir="ltr">{normalizedPhone}</span> ارسال شد.
            </p>
            <p className="mt-2 text-xs leading-6 text-muted-foreground">
              کد تست موقت:
              <span dir="ltr" className="mr-2 rounded-md bg-white px-2 py-1 font-mono text-foreground">
                {MOCK_OTP_CODE}
              </span>
            </p>
          </div>

          <div className="space-y-3">
            <Label>کد تایید</Label>
            <div
              className="flex items-center justify-between gap-2"
              dir="ltr"
              onPaste={handleOtpPaste}
            >
              {otpDigits.map((digit, index) => (
                <Input
                  key={index}
                  ref={(element) => {
                    otpRefs.current[index] = element;
                  }}
                  value={digit}
                  inputMode="numeric"
                  maxLength={1}
                  aria-label={`رقم ${index + 1} کد تایید`}
                  onChange={(event) => {
                    updateOtpDigit(index, event.target.value);
                    setError("");
                  }}
                  onKeyDown={(event) => handleOtpKeyDown(event, index)}
                  className={cn(
                    "h-12 w-12 rounded-2xl px-0 text-center text-lg font-semibold sm:h-14 sm:w-14",
                    error && "border-destructive ring-destructive/20",
                  )}
                />
              ))}
            </div>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" className="h-11 flex-1 text-sm font-semibold">
              <CheckCircle2 className="size-4" />
              تایید و ورود
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1 text-sm font-semibold"
              onClick={handleBackToPhone}
            >
              تغییر شماره
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
