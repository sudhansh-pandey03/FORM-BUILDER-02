"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "~/hooks/api/auth";

export default function Home() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Wait for the session check to finish; otherwise `user` is still undefined
    // on the first render and logged-in users get bounced to /login.
    if (isLoading) return;
    router.replace(user?.id ? "/dashboard" : "/login");
  }, [user, isLoading, router]);

  return (
    <main className="min-h-screen min-w-screen flex justify-center items-center">
      <p className="text-sm text-muted-foreground">Loading...</p>
    </main>
  );
}
