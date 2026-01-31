"use client";

import { LoginForm } from "@/components/login-form"

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 self-center font-medium mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="text-lg font-bold">N</span>
          </div>
          <span className="text-xl font-bold">Notadebayo</span>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
