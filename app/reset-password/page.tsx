import type { Metadata } from "next";
import { Suspense } from "react";
import { PlainShell } from "@/components/shells/plain-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <PlainShell>
      <Suspense fallback={<div className="min-h-[70vh]" />}>
        <ResetPasswordForm />
      </Suspense>
    </PlainShell>
  );
}
